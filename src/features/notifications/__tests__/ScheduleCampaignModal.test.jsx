import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { App } from "antd";
import ScheduleCampaignModal from "../components/ScheduleCampaignModal";
import { notificationCampaignService } from "../services/notificationService";

jest.mock("../services/notificationService", () => ({
  notificationCampaignService: {
    getAudience: jest.fn(),
    sendNow: jest.fn(),
    schedule: jest.fn(),
  },
}));

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
});

const campaign = { id: 7, name: "Ekim duyurusu" };
const run = (fn) => fn().then((r) => r ?? true);

function renderModal(onDone = jest.fn()) {
  render(
    <App>
      <ScheduleCampaignModal open campaign={campaign} run={run} onClose={jest.fn()} onDone={onDone} />
    </App>,
  );
  return onDone;
}

const sendButton = () => screen.getByRole("button", { name: /Şimdi Gönder/ });

describe("ScheduleCampaignModal", () => {
  afterEach(() => jest.clearAllMocks());

  it("requires explicit confirmation before sending to a large audience", async () => {
    notificationCampaignService.getAudience.mockResolvedValue({
      data: { recipientCount: 2500, withActiveDeviceCount: 2000, requiresConfirmation: true, largeAudienceThreshold: 1000, sample: [], invalidUserIds: [] },
    });
    notificationCampaignService.sendNow.mockResolvedValue({ data: { id: 7, status: "Scheduled" } });
    const onDone = renderModal();

    await screen.findByText(/2500 kullanıcıya gönderileceğini onaylıyorum/);
    expect(sendButton()).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox"));
    await waitFor(() => expect(sendButton()).not.toBeDisabled());
    fireEvent.click(sendButton());

    await waitFor(() => expect(notificationCampaignService.sendNow).toHaveBeenCalledWith(7, { confirmLargeAudience: true }));
    await waitFor(() => expect(onDone).toHaveBeenCalled());
  });

  it("sends a small audience without the extra confirmation", async () => {
    notificationCampaignService.getAudience.mockResolvedValue({
      data: { recipientCount: 3, withActiveDeviceCount: 1, requiresConfirmation: false, largeAudienceThreshold: 1000, sample: [], invalidUserIds: [] },
    });
    notificationCampaignService.sendNow.mockResolvedValue({ data: { id: 7 } });
    renderModal();

    await waitFor(() => expect(sendButton()).not.toBeDisabled());
    expect(screen.queryByRole("checkbox")).toBeNull();
    fireEvent.click(sendButton());
    await waitFor(() => expect(notificationCampaignService.sendNow).toHaveBeenCalledWith(7, { confirmLargeAudience: false }));
  });

  it("blocks sending when the audience is empty", async () => {
    notificationCampaignService.getAudience.mockResolvedValue({
      data: { recipientCount: 0, withActiveDeviceCount: 0, requiresConfirmation: false, largeAudienceThreshold: 1000, sample: [], invalidUserIds: [] },
    });
    renderModal();

    await screen.findByText(/bildirim alabilecek kullanıcı yok/);
    expect(sendButton()).toBeDisabled();
  });
});
