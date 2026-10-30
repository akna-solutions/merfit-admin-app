import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { App } from "antd";
import PurgeUserModal from "../components/PurgeUserModal";

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
});

const user = { id: 7, firstName: "Ada", lastName: "Yılmaz", email: "Ada@Example.com" };

const purgeButton = () => screen.getByRole("button", { name: /Kalıcı olarak sil/ });

describe("PurgeUserModal", () => {
  it("keeps the delete button disabled until the e-mail is typed, then submits", async () => {
    const onSubmit = jest.fn(() => Promise.resolve());
    render(
      <App>
        <PurgeUserModal user={user} onClose={jest.fn()} onSubmit={onSubmit} />
      </App>,
    );

    expect(purgeButton()).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(user.email), { target: { value: "ada@example.com" } });
    await waitFor(() => expect(purgeButton()).not.toBeDisabled());

    fireEvent.click(purgeButton());
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ confirmEmail: "ada@example.com", reason: null }));
  });

  it("shows the API error inside the modal", async () => {
    const onSubmit = jest.fn(() => Promise.reject(new Error("Kendi hesabınızı silemezsiniz.")));
    render(
      <App>
        <PurgeUserModal user={user} onClose={jest.fn()} onSubmit={onSubmit} />
      </App>,
    );

    fireEvent.change(screen.getByPlaceholderText(user.email), { target: { value: user.email } });
    await waitFor(() => expect(purgeButton()).not.toBeDisabled());
    fireEvent.click(purgeButton());

    expect(await screen.findByText("Kendi hesabınızı silemezsiniz.")).toBeInTheDocument();
  });

});
