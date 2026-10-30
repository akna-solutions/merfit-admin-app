import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { App } from "antd";
import ChangePasswordCard from "../components/ChangePasswordCard";
import { authService } from "../../auth/services/authService";

jest.mock("../../auth/services/authService", () => ({
  authService: { changePassword: jest.fn() },
}));

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
});

function fill({ current, next, confirm }) {
  fireEvent.change(screen.getByLabelText("Mevcut şifre"), { target: { value: current } });
  fireEvent.change(screen.getByLabelText("Yeni şifre"), { target: { value: next } });
  fireEvent.change(screen.getByLabelText("Yeni şifre (tekrar)"), { target: { value: confirm } });
  fireEvent.click(screen.getByText("Şifreyi değiştir").closest("button"));
}

function renderCard() {
  render(
    <App>
      <ChangePasswordCard />
    </App>,
  );
}

describe("ChangePasswordCard", () => {
  afterEach(() => jest.clearAllMocks());

  it("sends the current and new password to the API", async () => {
    authService.changePassword.mockResolvedValue({ isSuccess: true });
    renderCard();

    fill({ current: "eski-parola", next: "yeni-parola-1", confirm: "yeni-parola-1" });

    await waitFor(() =>
      expect(authService.changePassword).toHaveBeenCalledWith({
        currentPassword: "eski-parola",
        newPassword: "yeni-parola-1",
        confirmNewPassword: "yeni-parola-1",
      }),
    );
    expect(await screen.findByText("Şifreniz değiştirildi.")).toBeInTheDocument();
  });

  it("blocks mismatched or short passwords before calling the API", async () => {
    renderCard();

    fill({ current: "eski-parola", next: "kisa", confirm: "baska" });

    expect(await screen.findByText("En az 8 karakter olmalı")).toBeInTheDocument();
    expect(await screen.findByText("Şifreler eşleşmiyor")).toBeInTheDocument();
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it("shows the API error, e.g. a wrong current password", async () => {
    authService.changePassword.mockRejectedValue(new Error("Mevcut parola hatali."));
    renderCard();

    fill({ current: "yanlis", next: "yeni-parola-1", confirm: "yeni-parola-1" });

    expect(await screen.findByText("Mevcut parola hatali.")).toBeInTheDocument();
  });
});
