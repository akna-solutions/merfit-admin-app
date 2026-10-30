import React from "react";
import { emailMatches } from "../components/PurgeUserModal";
import { buildUsersColumns } from "../components/usersColumns";
import { userService } from "../services/userService";
import { apiClient } from "../../../utils/apiClient";

// @ant-design/icons yalnızca ESM yayınlar ve CRA'nın Jest ayarı node_modules'u dönüştürmez.
jest.mock("@ant-design/icons", () =>
  new Proxy({}, { get: (_, name) => (name === "__esModule" ? false : () => null) }),
);

// CRA'nın Jest'i react-router v7'nin "exports" alt yollarını çözemiyor; bu testte router gerekmiyor.
jest.mock("react-router-dom", () => ({ Link: ({ children }) => children }));

jest.mock("../../../utils/apiClient", () => ({
  apiClient: { post: jest.fn(() => Promise.resolve({ isSuccess: true })) },
  buildQuery: () => "",
}));

const user = { id: 7, firstName: "Ada", lastName: "Yılmaz", email: "Ada@Example.com", isActive: true, isDeleted: false };

function actionsFor(record, onPurge = jest.fn()) {
  const columns = buildUsersColumns({
    onView: jest.fn(),
    onToggleStatus: jest.fn(),
    onToggleEmailConfirmation: jest.fn(),
    onDelete: jest.fn(),
    onRestore: jest.fn(),
    onPurge,
  });
  return columns.find((c) => c.key === "actions").render(null, record).props.items;
}

describe("kalıcı kullanıcı silme", () => {
  afterEach(() => jest.clearAllMocks());

  it("offers permanent delete for active and soft-deleted users without a one-click confirm", () => {
    const onPurge = jest.fn();
    for (const record of [user, { ...user, isDeleted: true }]) {
      const action = actionsFor(record, onPurge).find((a) => a.key === "purge");
      expect(action.danger).toBe(true);
      expect(action.confirm).toBeUndefined();
      action.onClick();
    }
    expect(onPurge).toHaveBeenCalledTimes(2);
  });

  it("matches the typed e-mail case-insensitively", () => {
    expect(emailMatches(" ada@example.COM ", user.email)).toBe(true);
    expect(emailMatches("ada@example.co", user.email)).toBe(false);
    expect(emailMatches("", user.email)).toBe(false);
  });

  it("posts to the purge endpoint", async () => {
    await userService.purgeUser(7, { confirmEmail: "ada@example.com", reason: "talep" });
    expect(apiClient.post).toHaveBeenCalledWith("/api/admin/users/7/purge", { confirmEmail: "ada@example.com", reason: "talep" });
  });
});
