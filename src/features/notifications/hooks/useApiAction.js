import { useCallback } from "react";
import { App } from "antd";

/**
 * Bir API cagrisini calistirir; basarida mesaj gosterir, hatada API'nin dondugu Turkce hata
 * mesajini gosterir. Hata yutulmaz: cagiran taraf (orn. form) acik kalabilsin diye false doner.
 */
export function useApiAction() {
  const { message } = App.useApp();

  return useCallback(
    async (fn, successMessage) => {
      try {
        const result = await fn();
        if (successMessage) {
          message.success(typeof successMessage === "function" ? successMessage(result) : successMessage);
        }
        return result ?? true;
      } catch (error) {
        const details = (error.errors ?? []).filter((e) => e && e !== error.message);
        message.error([error.message, ...details].filter(Boolean).join(" "));
        return false;
      }
    },
    [message],
  );
}
