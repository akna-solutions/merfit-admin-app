// Real MerfitApi calls (see MerfitApi repo, running at http://localhost:5000):
//   POST /api/auth/login        (MerfitApi.Api/Controllers/AuthController.cs)
//     body: LoginRequest { emailOrUsername, password }
//     returns: AuthResponse { userId, email, name, accessToken, refreshToken, accessTokenExpiresAt }
//     Note: this endpoint returns AuthResponse directly, NOT wrapped in the
//     ApiResponse envelope the /api/admin/* endpoints use.
//   GET  /api/admin/auth/me     (MerfitApi.Api/Controllers/Admin/AdminAuthController.cs)
//     header: Authorization: Bearer {accessToken}
//     returns: ApiResponse<AdminMeResponse> -> data: { userId, email, role, lastLoginAt }
//
// /api/auth/login itself doesn't gate by role — it's shared with the mobile
// app, so any valid MERFIT account can log in there. Admin-panel access is
// enforced by /api/admin/auth/me instead, which 403s a token whose role
// isn't Admin or SuperAdmin (see AuthContext.login, which calls both in
// sequence).
import { apiClient } from "../../../utils/apiClient";

export const authService = {
  /** POST /api/auth/login */
  async login({ emailOrUsername, password }) {
    return apiClient.post("/api/auth/login", { emailOrUsername, password }, { token: null });
  },

  /** GET /api/admin/auth/me */
  async me(accessToken) {
    const response = await apiClient.get("/api/admin/auth/me", { token: accessToken });
    return response.data;
  },
};
