import { createContext, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { FacturaNotification } from "@/domain/factura/factura.types";

type ToastVisibility = "hidden" | "visible" | "hiding";

type ToastState = {
  notification: FacturaNotification;
  visibility: ToastVisibility;
};

type NotificationContextValue = {
  notifications: FacturaNotification[];
  toast: ToastState | null;
  addNotification: (noti: Omit<FacturaNotification, "id" | "createdAt" | "read">) => void;
  showToast: (noti: Omit<FacturaNotification, "id" | "createdAt" | "read">) => void;
  hideToast: () => void;
  removeNotification: (id: string) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

let nextId = 1;
function generateId(): string {
  return `noti-${Date.now()}-${nextId++}`;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<FacturaNotification[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addNotification = useCallback((noti: Omit<FacturaNotification, "id" | "createdAt" | "read">) => {
    const newNoti: FacturaNotification = {
      ...noti,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNoti, ...prev]);
  }, []);

  const showToast = useCallback((noti: Omit<FacturaNotification, "id" | "createdAt" | "read">) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);

    const newNoti: FacturaNotification = {
      ...noti,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [newNoti, ...prev]);
    setToast({ notification: newNoti, visibility: "visible" });

    toastTimer.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visibility: "hiding" } : null));
      setTimeout(() => setToast(null), 300);
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast((prev) => (prev ? { ...prev, visibility: "hiding" } : null));
    setTimeout(() => setToast(null), 300);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      toast,
      addNotification,
      showToast,
      hideToast,
      removeNotification,
      markAllAsRead,
    }),
    [notifications, toast, addNotification, showToast, hideToast, removeNotification, markAllAsRead],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used inside NotificationProvider");
  return ctx;
}
