import { apiClient, tokenStore, SESSION_EXPIRED_EVENT, AUTH_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "../apiClient";

const json = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: () => Promise.resolve(body === undefined ? "" : JSON.stringify(body)),
  json: () => Promise.resolve(body),
});

const authHeader = (call) => call[1].headers.Authorization;

describe("apiClient oturum yenileme", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = jest.fn();
  });

  it("renews an expired access token once and retries the request", async () => {
    tokenStore.save({ accessToken: "old", refreshToken: "r1" }, { remember: true });
    fetch
      .mockResolvedValueOnce(json(401))
      .mockResolvedValueOnce(json(200, { accessToken: "new", refreshToken: "r2" }))
      .mockResolvedValueOnce(json(200, { data: "ok" }));

    await expect(apiClient.get("/api/admin/users")).resolves.toEqual({ data: "ok" });

    expect(fetch.mock.calls[1][0]).toBe("/api/auth/refresh");
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ refreshToken: "r1" });
    expect(authHeader(fetch.mock.calls[2])).toBe("Bearer new");
    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe("new");
    expect(localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBe("r2");
  });

  it("shares one refresh call between parallel requests", async () => {
    tokenStore.save({ accessToken: "old", refreshToken: "r1" }, { remember: true });
    fetch.mockImplementation((url, init) => {
      if (url === "/api/auth/refresh") return Promise.resolve(json(200, { accessToken: "new", refreshToken: "r2" }));
      return Promise.resolve(init.headers.Authorization === "Bearer new" ? json(200, { ok: true }) : json(401));
    });

    await Promise.all([apiClient.get("/a"), apiClient.get("/b"), apiClient.get("/c")]);

    expect(fetch.mock.calls.filter(([url]) => url === "/api/auth/refresh")).toHaveLength(1);
  });

  it("clears the session and announces expiry when the refresh token is rejected", async () => {
    tokenStore.save({ accessToken: "old", refreshToken: "r1" }, { remember: false });
    const expired = jest.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, expired);
    fetch.mockResolvedValueOnce(json(401)).mockResolvedValueOnce(json(401, { errorMessage: "x" }));

    await expect(apiClient.get("/api/admin/users")).rejects.toMatchObject({ status: 401 });

    expect(expired).toHaveBeenCalledTimes(1);
    expect(tokenStore.getAccessToken()).toBeNull();
    expect(tokenStore.getRefreshToken()).toBeNull();
    window.removeEventListener(SESSION_EXPIRED_EVENT, expired);
  });

  it("does not try to refresh calls made with an explicit token, such as login", async () => {
    tokenStore.save({ accessToken: "old", refreshToken: "r1" }, { remember: true });
    fetch.mockResolvedValueOnce(json(401, { errorMessage: "Hatalı parola" }));

    await expect(apiClient.post("/api/auth/login", {}, { token: null })).rejects.toThrow("Hatalı parola");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("keeps a non-remembered session in sessionStorage", () => {
    tokenStore.save({ accessToken: "a", refreshToken: "r" }, { remember: false });

    expect(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)).toBe("a");
    expect(tokenStore.getRefreshToken()).toBe("r");
  });
});
