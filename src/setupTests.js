// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom'da olmayan, antd form bileşenlerinin kullandığı tarayıcı API'leri:
// Form.useWatch bildirimleri MessageChannel ile toplar, Input.TextArea ResizeObserver kullanır.
if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = class {
    constructor() {
      this.port1 = {};
      this.port2 = { postMessage: () => setTimeout(() => this.port1.onmessage?.()) };
    }
  };
}
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
// jsdom'un seçici motoru (nwsapi) antd'nin bazı CSS-in-JS seçicilerinde getComputedStyle içinde
// hata fırlatıyor (Input.Password, Input.TextArea). Gerçek tarayıcıda olmayan bu hatayı yutar.
const realGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element, pseudoElement) => {
  try {
    return realGetComputedStyle(element, pseudoElement);
  } catch {
    // Boş stil: her özellik "" döner.
    return new Proxy({ getPropertyValue: () => '' }, { get: (target, key) => (key in target ? target[key] : '') });
  }
};
