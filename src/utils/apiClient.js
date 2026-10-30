// Thin fetch wrapper for talking to the real MBFitApi backend (see
// MBFitApi repo, running at http://localhost:5000).
//
// In development this app is served by CRA's dev server on its own port,
// so calls use *relative* paths ("/api/..."). package.json's "proxy" field
// forwards those to http://localhost:5000, which avoids needing CORS set
// up on the .NET side. Set REACT_APP_API_BASE_URL if you ever need to point
// at a different host (e.g. a deployed API) instead of relying on the proxy.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

export const AUTH_TOKEN_STORAGE_KEY = "mbfit_admin_access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "mbfit_admin_refresh_token";
export const SESSION_EXPIRED_EVENT = "mbfit:session-expired";

// "Beni hatırla" seçiliyse oturum localStorage'da, değilse sekme kapanana kadar sessionStorage'da tutulur.
function sessionStorageArea() {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
    ? localStorage
    : sessionStorage;
}

export const tokenStore = {
  getAccessToken: () => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
  getRefreshToken: () =>
    localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY),
  save({ accessToken, refreshToken }, { remember } = {}) {
    const area = remember === undefined ? sessionStorageArea() : remember ? localStorage : sessionStorage;
    tokenStore.clear();
    area.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) area.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  },
  clear() {
    [localStorage, sessionStorage].forEach((area) => {
      area.removeItem(AUTH_TOKEN_STORAGE_KEY);
      area.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    });
  },
};

function statusToCode(status) {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    default:
      return "SERVER_ERROR";
  }
}

function defaultMessage(status) {
  switch (status) {
    case 401:
      return "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.";
    case 403:
      return "Bu işlemi yapmak için izniniz yok.";
    case 404:
      return "İstenen kaynak bulunamadı.";
    default:
      return "Bir şeyler ters gitti. Lütfen tekrar deneyin.";
  }
}

// token === undefined -> read the stored session token (default).
// token === null      -> send the request with no Authorization header
//                        (used for the login call itself).
// token === "..."     -> use that exact token (used right after login,
//                        before it's necessarily persisted to storage).
async function request(path, options = {}) {
  const sentAccessToken = tokenStore.getAccessToken();
  const response = await send(path, options);
  // Access token'ın süresi dolduysa (60 dk) refresh token ile sessizce yenileyip isteği bir kez tekrarla.
  // Yalnızca saklı oturumla yapılan istekler için; login ve refresh çağrıları açıkça token verir.
  if (response.status === 401 && options.token === undefined && tokenStore.getRefreshToken()) {
    // Başka bir sekme ya da istek token'ı zaten yenilemişse doğrudan yeni token'la dene.
    const renewed = tokenStore.getAccessToken() !== sentAccessToken || (await refreshSession());
    if (renewed) {
      return parse(await send(path, options));
    }
  }
  return parse(response);
}

let refreshInFlight = null;

// Aynı anda düşen birden çok istek tek bir refresh çağrısını paylaşır; refresh token tek kullanımlıktır.
function refreshSession() {
  if (!refreshInFlight) {
    refreshInFlight = renewTokens().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function renewTokens() {
  const refreshToken = tokenStore.getRefreshToken();
  let response;
  try {
    response = await send("/api/auth/refresh", { method: "POST", body: { refreshToken }, token: null });
  } catch {
    return false; // Ağ hatası: oturumu kapatma, bir sonraki istekte tekrar denenir.
  }

  if (response.ok) {
    tokenStore.save(await response.json());
    return true;
  }

  // Aynı anda başka bir sekme yenilediyse saklı token değişmiştir; onu kullan.
  if (tokenStore.getRefreshToken() && tokenStore.getRefreshToken() !== refreshToken) {
    return true;
  }

  tokenStore.clear();
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  return false;
}

async function send(path, { method = "GET", body, token, headers } = {}) {
  const authToken = token !== undefined ? token : tokenStore.getAccessToken();

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    const error = new Error("Sunucuya ulaşılamadı. API localhost:5000 üzerinde çalışıyor mu?");
    error.code = "NETWORK_ERROR";
    throw error;
  }

  return response;
}

async function parse(response) {
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message = payload?.errorMessage || defaultMessage(response.status);
    const error = new Error(message);
    error.status = response.status;
    error.code = statusToCode(response.status);
    error.errors = payload?.errors ?? [];
    throw error;
  }

  return payload;
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

/** Builds a "?a=1&b=2" query string, skipping undefined/null/empty values. */
export function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
