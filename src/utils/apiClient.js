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
async function request(path, { method = "GET", body, token, headers } = {}) {
  const authToken = token !== undefined ? token : localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

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
