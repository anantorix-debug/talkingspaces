"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastType = "success" | "error";
type ToastItem = { id: number; type: ToastType; message: string };

const ToastContext = createContext<{ show: (type: ToastType, message: string) => void } | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((type: ToastType, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
            {toasts.map((t) => (
              <div
                key={t.id}
                role="status"
                className={`flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg ${
                  t.type === "success" ? "bg-teal-dark" : "bg-red-600"
                }`}
              >
                {t.type === "success" ? (
                  <CheckCircle2 size={16} className="shrink-0" />
                ) : (
                  <XCircle size={16} className="shrink-0" />
                )}
                {t.message}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return {
    success: (message: string) => ctx.show("success", message),
    error: (message: string) => ctx.show("error", message),
  };
}
