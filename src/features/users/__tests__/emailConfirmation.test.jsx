import React from "react";
import { render, screen } from "@testing-library/react";
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
  apiClient: { patch: jest.fn(() => Promise.resolve({ isSuccess: true })) },
  buildQuery: () => "",
}));

const baseUser = {
  id: 7,
  firstName: "Ada",
  lastName: "Yılmaz",
  email: "ada@example.com",
  isActive: true,
  isDeleted: false,
};

function setup(user) {
  const handlers = {
    onView: jest.fn(),
    onToggleStatus: jest.fn(),
    onToggleEmailConfirmation: jest.fn(),
    onDelete: jest.fn(),
    onRestore: jest.fn(),
  };
  const columns = buildUsersColumns(handlers);
  const emailColumn = columns.find((c) => c.key === "emailConfirmed");
  const actions = columns.find((c) => c.key === "actions").render(null, user).props.items;
  return { handlers, emailColumn, actions };
}

describe("users e-mail confirmation", () => {
  it("shows the verification state as a tag", () => {
    const { emailColumn } = setup(baseUser);
    const { unmount } = render(emailColumn.render(false));
    expect(screen.getByText("Doğrulanmamış")).toBeInTheDocument();
    unmount();
    render(emailColumn.render(true));
    expect(screen.getByText("Doğrulanmış")).toBeInTheDocument();
  });

  it("offers to mark an unverified e-mail as verified", () => {
    const { actions, handlers } = setup({ ...baseUser, emailConfirmed: false });
    const action = actions.find((a) => a.key === "emailConfirmation");
    expect(action.label).toBe("E-postayı doğrulanmış işaretle");
    action.onClick();
    expect(handlers.onToggleEmailConfirmation).toHaveBeenCalledWith(expect.objectContaining({ id: 7 }));
  });

  it("offers to revoke a verified e-mail behind a confirmation", () => {
    const { actions } = setup({ ...baseUser, emailConfirmed: true });
    const action = actions.find((a) => a.key === "emailConfirmation");
    expect(action.label).toBe("E-posta doğrulamasını kaldır");
    expect(action.confirm).toMatch(/kodu girmek zorunda/);
  });

  it("does not offer the action for deleted users", () => {
    const { actions } = setup({ ...baseUser, isDeleted: true, emailConfirmed: false });
    expect(actions.find((a) => a.key === "emailConfirmation")).toBeUndefined();
  });

  it("calls the admin endpoint", async () => {
    await userService.updateEmailConfirmation(7, { emailConfirmed: true });
    expect(apiClient.patch).toHaveBeenCalledWith("/api/admin/users/7/email-confirmation", {
      emailConfirmed: true,
      reason: undefined,
    });
  });
});
