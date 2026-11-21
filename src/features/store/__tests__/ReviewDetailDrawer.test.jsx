import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "antd";
import ReviewDetailDrawer from "../components/ReviewDetailDrawer";
import { storeReviewService } from "../services/storeService";
import { reviewFiltersToQuery } from "../utils/storeForms";

jest.mock("../services/storeService", () => ({
  storeReviewService: { getReview: jest.fn(), updateStatus: jest.fn(), deleteReview: jest.fn(), dismissReports: jest.fn(), getImage: jest.fn() },
}));

beforeAll(() => {
  if (typeof global.MessageChannel === "undefined") {
    global.MessageChannel = class {
      constructor() {
        this.port1 = { onmessage: null };
        this.port2 = { postMessage: (data) => setTimeout(() => this.port1.onmessage?.({ data }), 0) };
      }
    };
  }
  if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
  global.URL.createObjectURL = jest.fn(() => "blob:review-image");
  global.URL.revokeObjectURL = jest.fn();
});

const review = (overrides = {}) => ({
  id: 12,
  productId: 3,
  productName: "Whey Protein 2 kg",
  userId: 7,
  userEmail: "ayse@example.com",
  userName: "ayse",
  rating: 2,
  title: "Paket hasarlı",
  comment: "<script>alert(1)</script> Kutusu ezik geldi.",
  isVerifiedPurchase: true,
  status: "Published",
  helpfulCount: 4,
  notHelpfulCount: 1,
  imageCount: 1,
  openReportCount: 1,
  reportCount: 1,
  createdAt: "2026-11-20T10:00:00Z",
  editedAt: null,
  moderationNote: null,
  moderatedAt: null,
  deletedAt: null,
  images: [{ id: 30, contentType: "image/jpeg", byteSize: 1000, width: 800, height: 600 }],
  reports: [{ id: 5, reporterUserId: 9, reporterEmail: "mert@example.com", reason: "Offensive", description: "Kaba dil", status: "Open", createdAt: "2026-11-20T11:00:00Z", resolvedAt: null }],
  history: [{ action: "CREATED", adminUserId: null, createdAt: "2026-11-20T10:00:00Z" }],
  allowedStatusTransitions: ["Hidden", "Deleted"],
  ...overrides,
});

const renderDrawer = (onChanged = jest.fn()) => {
  render(
    <App>
      <ReviewDetailDrawer reviewId={12} onClose={jest.fn()} onChanged={onChanged} />
    </App>,
  );
  return onChanged;
};

describe("ReviewDetailDrawer", () => {
  beforeEach(() => storeReviewService.getImage.mockResolvedValue(new Blob(["x"], { type: "image/jpeg" })));
  afterEach(() => jest.clearAllMocks());

  it("yorumu, raporları, rozeti ve fotoğrafı gösterir; metni HTML olarak yorumlamaz", async () => {
    storeReviewService.getReview.mockResolvedValue({ data: review() });
    renderDrawer();
    expect(await screen.findByText("Paket hasarlı")).toBeInTheDocument();
    expect(screen.getByTestId("review-comment").textContent).toContain("<script>alert(1)</script>");
    expect(document.querySelector("script")).toBeNull();
    expect(screen.getByText("✓ Onaylı alışveriş")).toBeInTheDocument();
    expect(screen.getByText("Hakaret / saldırgan içerik")).toBeInTheDocument();
    expect(screen.getByText("mert@example.com")).toBeInTheDocument();
    expect(screen.getByText("Kullanıcı yorumu yazdı")).toBeInTheDocument();
    await waitFor(() => expect(storeReviewService.getImage).toHaveBeenCalledWith(12, 30));
    // Yalnızca izinli geçişlerin butonları
    expect(screen.getByRole("button", { name: "Gizle" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Yeniden yayınla" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Raporları kapat" })).toBeInTheDocument();
  });

  it("gizleme notla birlikte sunucuya gider ve dönen yorumu gösterir", async () => {
    storeReviewService.getReview.mockResolvedValue({ data: review() });
    storeReviewService.updateStatus.mockResolvedValue({
      data: review({ status: "Hidden", allowedStatusTransitions: ["Published", "Deleted"], openReportCount: 0, moderationNote: "Hakaret" }),
    });
    const onChanged = renderDrawer();
    await screen.findByText("Paket hasarlı");
    fireEvent.change(screen.getByLabelText("İşlem notu"), { target: { value: " Hakaret " } });
    fireEvent.click(screen.getByRole("button", { name: "Gizle" }));
    await waitFor(() => expect(storeReviewService.updateStatus).toHaveBeenCalledWith(12, { status: "Hidden", note: "Hakaret" }));
    expect(await screen.findByRole("button", { name: "Yeniden yayınla" })).toBeInTheDocument();
    expect(onChanged).toHaveBeenCalled();
  });

  it("sunucu 409 dönerse hata gösterir ve yorumu yeniden yükler", async () => {
    storeReviewService.getReview.mockResolvedValue({ data: review() });
    storeReviewService.updateStatus.mockRejectedValue(Object.assign(new Error("Yorum ayni anda baska bir islemle degisti."), { status: 409, errors: [] }));
    const onChanged = renderDrawer();
    await screen.findByText("Paket hasarlı");
    fireEvent.click(screen.getByRole("button", { name: "Gizle" }));
    expect(await screen.findByText(/baska bir islemle degisti/)).toBeInTheDocument();
    await waitFor(() => expect(storeReviewService.getReview).toHaveBeenCalledTimes(2));
    expect(onChanged).not.toHaveBeenCalled();
  });

  it("silme onaydan sonra yapılır; silinmiş yorumda işlem yapılamaz", async () => {
    storeReviewService.getReview.mockResolvedValue({ data: review() });
    storeReviewService.deleteReview.mockResolvedValue({ data: review({ status: "Deleted", allowedStatusTransitions: [] }) });
    renderDrawer();
    await screen.findByText("Paket hasarlı");
    fireEvent.click(screen.getByRole("button", { name: "Sil" }));
    expect(storeReviewService.deleteReview).not.toHaveBeenCalled();
    expect(await screen.findByText("Yorum silinsin mi?")).toBeInTheDocument();
    const deleteButtons = screen.getAllByRole("button", { name: "Sil" });
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => expect(storeReviewService.deleteReview).toHaveBeenCalledWith(12, { note: null }));
    expect(await screen.findByText("Silinmiş yorumda işlem yapılamaz.")).toBeInTheDocument();
  });
});

describe("reviewFiltersToQuery", () => {
  it("'all' seçimlerini göndermez ve onay filtresini boolean'a çevirir", () => {
    expect(reviewFiltersToQuery({ search: "x", rating: "all", status: "all", reportedOnly: false, verifiedPurchase: undefined, productId: undefined })).toEqual({
      search: "x",
      productId: undefined,
      rating: undefined,
      status: undefined,
      reportedOnly: undefined,
      verifiedPurchase: undefined,
    });
    expect(reviewFiltersToQuery({ rating: 1, status: "Hidden", reportedOnly: true, verifiedPurchase: "no", productId: 4 })).toEqual({
      productId: 4,
      rating: 1,
      status: "Hidden",
      reportedOnly: true,
      verifiedPurchase: false,
    });
  });
});
