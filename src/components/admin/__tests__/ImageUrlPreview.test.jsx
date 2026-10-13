import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Form } from "antd";
import ImageUrlPreview from "../ImageUrlPreview";
import ImageUrlInput from "../ImageUrlInput";
import { previewableImageUrl, resolveImageUrl } from "../../../utils/imageUrl";

// @ant-design/icons yalnızca ESM yayınlar ve CRA'nın Jest ayarı node_modules'u dönüştürmez.
jest.mock("@ant-design/icons", () => ({
  PictureOutlined: () => null,
  WarningOutlined: () => null,
  FileExclamationOutlined: () => null,
}));

beforeAll(() => {
  window.matchMedia =
    window.matchMedia ||
    ((query) => ({ matches: false, media: query, onchange: null, addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn() }));
  // antd Form, jsdom'da bulunmayan MessageChannel'ı kullanır.
  global.MessageChannel =
    global.MessageChannel ||
    class {
      constructor() {
        this.port1 = {};
        this.port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.({}), 0) };
      }
    };
});

const IMG = "https://cdn.example.com/a.png";
const IMG_2 = "https://cdn.example.com/b.png";

describe("resolveImageUrl", () => {
  it.each([null, undefined, "", "   ", 42])("treats %p as empty", (value) => {
    expect(resolveImageUrl(value)).toEqual({ status: "empty" });
  });

  it.each(["foo", "www.example.com/a.png", "mailto:admin@example.com", "ftp://example.com/a.png", "https://"])(
    "treats %p as invalid",
    (value) => {
      expect(resolveImageUrl(value).status).toBe("invalid");
    },
  );

  it("trims valid http(s) urls", () => {
    expect(resolveImageUrl(`  ${IMG}  `)).toEqual({ status: "valid", url: IMG });
    expect(previewableImageUrl("http://example.com/x.jpg")).toBe("http://example.com/x.jpg");
    expect(previewableImageUrl("nope")).toBeUndefined();
  });
});

describe("ImageUrlPreview", () => {
  it("shows a placeholder when there is no url", () => {
    render(<ImageUrlPreview url="  " alt="Kapak" />);
    expect(screen.getByRole("img", { name: "Görsel yok" })).toBeInTheDocument();
    expect(screen.queryByAltText("Kapak")).toBeNull();
  });

  it("shows a warning for malformed urls without requesting anything", () => {
    render(<ImageUrlPreview url="not a url" alt="Kapak" />);
    expect(screen.getByRole("img", { name: "Geçerli bir görsel URL'si değil" })).toBeInTheDocument();
    expect(screen.queryByAltText("Kapak")).toBeNull();
  });

  it("goes from loading to loaded and links to the original", () => {
    render(<ImageUrlPreview url={IMG} alt="Kapak" />);
    expect(screen.getByRole("img", { name: "Görsel yükleniyor" })).toBeInTheDocument();
    const img = screen.getByAltText("Kapak");
    fireEvent.load(img);
    expect(screen.queryByRole("img", { name: "Görsel yükleniyor" })).toBeNull();
    expect(screen.getByRole("link", { name: "Kapak" })).toHaveAttribute("href", IMG);
  });

  it("replaces a broken image with a fallback", () => {
    render(<ImageUrlPreview url={IMG} alt="Kapak" />);
    fireEvent.error(screen.getByAltText("Kapak"));
    expect(screen.getByRole("img", { name: "Görsel yüklenemedi" })).toBeInTheDocument();
    expect(screen.queryByAltText("Kapak")).toBeNull();
  });
});

// antd Form'un CSS-in-JS seçicileri jsdom'un getComputedStyle'ını bozduğu için
// burada getByRole yerine doğrudan sorgular kullanılır.
describe("ImageUrlInput inside a Form", () => {
  afterEach(() => jest.useRealTimers());

  function mountForm(initialValues) {
    let formRef;
    function Harness() {
      const [form] = Form.useForm();
      formRef = form;
      return (
        <Form form={form} initialValues={initialValues}>
          <Form.Item name="imageUrl" label="Görsel URL">
            <ImageUrlInput previewAlt="Önizleme" />
          </Form.Item>
        </Form>
      );
    }
    render(<Harness />);
    return () => formRef;
  }

  it("shows the existing image immediately and debounces edits", () => {
    jest.useFakeTimers();
    mountForm({ imageUrl: IMG });
    expect(screen.getByAltText("Önizleme")).toHaveAttribute("src", IMG);

    fireEvent.change(screen.getByLabelText("Görsel URL"), { target: { value: IMG_2 } });
    expect(screen.getByAltText("Önizleme")).toHaveAttribute("src", IMG);
    act(() => jest.advanceTimersByTime(400));
    expect(screen.getByAltText("Önizleme")).toHaveAttribute("src", IMG_2);
  });

  it("never alters the submitted value", () => {
    const readForm = mountForm({});
    expect(screen.getByLabelText("Görsel yok")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Görsel URL"), { target: { value: `  ${IMG}` } });
    expect(readForm().getFieldValue("imageUrl")).toBe(`  ${IMG}`);
    expect(screen.getByAltText("Önizleme")).toHaveAttribute("src", IMG);
  });
});
