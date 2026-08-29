// Mock implementation of the two real endpoints the admin login flow uses
// (see MerfitApi repo):
//   POST /api/auth/login        (MerfitApi.Api/Controllers/AuthController.cs)
//     body: LoginRequest { emailOrUsername, password }
//     returns: AuthResponse { userId, email, name, accessToken, refreshToken, accessTokenExpiresAt }
//   GET  /api/admin/auth/me     (MerfitApi.Api/Controllers/Admin/AdminAuthController.cs)
//     header: Authorization: Bearer {accessToken}
//     returns: AdminMeResponse { userId, email, role, lastLoginAt }
//
// The real API doesn't gate /api/auth/login itself by role — anyone with a
// valid MERFIT account can log in there, since it's shared with the mobile
// app. Admin-panel access is enforced by checking /api/admin/auth/me
// afterwards (role must be Admin or SuperAdmin) — every other admin
// endpoint in this app presumably also 403s a plain "User" token. This
// mock reproduces that two-step shape so the real flow can drop in later.
import { simulateLatency } from "../../../utils/queryMockData";

const MOCK_ACCOUNTS = [
  { userId: 1, email: "admin@merfit.com", username: "admin", password: "admin123", name: "Merfit Admin", role: "SuperAdmin" },
  { userId: 2, email: "ops@merfit.com", username: "ops", password: "ops12345", name: "Ops Team", role: "Admin" },
  { userId: 3, email: "user@example.com", username: "regularuser", password: "user1234", name: "Regular User", role: "User" },
];

function findAccount(emailOrUsername) {
  const needle = emailOrUsername.trim().toLowerCase();
  return MOCK_ACCOUNTS.find((a) => a.email === needle || a.username === needle);
}

export const authService = {
  /** POST /api/auth/login — LoginRequest -> AuthResponse */
  async login({ emailOrUsername, password }) {
    await simulateLatency(null, 500);
    const account = findAccount(emailOrUsername);
    if (!account || account.password !== password) {
      const error = new Error("Invalid email/username or password.");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }
    const accessToken = `mock.${account.userId}.${Math.random().toString(36).slice(2)}`;
    return {
      userId: account.userId,
      email: account.email,
      name: account.name,
      accessToken,
      refreshToken: `refresh.${accessToken}`,
      accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      // kept only for the mock's own /me lookup below — a real client
      // never has direct access to this, only the opaque token.
      _role: account.role,
    };
  },

  /** GET /api/admin/auth/me — requires Bearer token, 403s a non-admin role */
  async me(accessToken) {
    await simulateLatency(null, 250);
    const userId = Number(accessToken?.split(".")[1]);
    const account = MOCK_ACCOUNTS.find((a) => a.userId === userId);
    if (!account) {
      const error = new Error("Invalid or expired session.");
      error.code = "UNAUTHORIZED";
      throw error;
    }
    if (account.role !== "Admin" && account.role !== "SuperAdmin") {
      const error = new Error("This account does not have admin panel access.");
      error.code = "FORBIDDEN";
      throw error;
    }
    return {
      userId: account.userId,
      email: account.email,
      role: account.role,
      lastLoginAt: new Date().toISOString(),
      name: account.name,
    };
  },
};
