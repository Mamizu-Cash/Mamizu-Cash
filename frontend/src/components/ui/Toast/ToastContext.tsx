import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000, // Default 5 seconds
      };

      setToasts((prev) => {
        // Remove oldest toasts if we exceed the limit
        const updatedToasts = prev.length >= maxToasts ? prev.slice(1) : prev;
        return [...updatedToasts, newToast];
      });

      // Auto-remove toast after duration (unless duration is 0 for persistent toasts)
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, newToast.duration);
      }
    },
    [maxToasts],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Convenience hooks for different toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    showSuccess: useCallback(
      (title: string, message?: string, options?: Partial<Toast>) => {
        addToast({ type: "success", title, message, ...options });
      },
      [addToast],
    ),

    showError: useCallback(
      (title: string, message?: string, options?: Partial<Toast>) => {
        addToast({ type: "error", title, message, duration: 0, ...options }); // Errors persist by default
      },
      [addToast],
    ),

    showWarning: useCallback(
      (title: string, message?: string, options?: Partial<Toast>) => {
        addToast({ type: "warning", title, message, ...options });
      },
      [addToast],
    ),

    showInfo: useCallback(
      (title: string, message?: string, options?: Partial<Toast>) => {
        addToast({ type: "info", title, message, ...options });
      },
      [addToast],
    ),
  };
};
