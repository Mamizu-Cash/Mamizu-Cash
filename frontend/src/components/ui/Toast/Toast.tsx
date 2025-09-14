import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import styles from "./Toast.module.css";
import type { Toast as ToastType } from "./ToastContext";

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const ToastIcon = ({ type }: { type: ToastType["type"] }) => {
  switch (type) {
    case "success":
      return <CheckCircle size={20} aria-hidden="true" />;
    case "error":
      return <XCircle size={20} aria-hidden="true" />;
    case "warning":
      return <AlertCircle size={20} aria-hidden="true" />;
    default:
      return <Info size={20} aria-hidden="true" />;
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsRemoving(true);
    // Allow exit animation to complete before removing
    setTimeout(() => {
      onClose(toast.id);
    }, 200);
  };

  const handleAction = () => {
    if (toast.action) {
      toast.action.onClick();
      handleClose();
    }
  };

  // Auto-close for keyboard users
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div
      className={`
        ${styles.toast}
        ${styles[toast.type]}
        ${isVisible ? styles.visible : ""}
        ${isRemoving ? styles.removing : ""}
      `}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.toastContent}>
        <div className={styles.toastIcon}>
          <ToastIcon type={toast.type} />
        </div>

        <div className={styles.toastText}>
          <div className={styles.toastTitle}>{toast.title}</div>
          {toast.message && <div className={styles.toastMessage}>{toast.message}</div>}
        </div>

        {toast.action && (
          <button
            className={styles.toastAction}
            onClick={handleAction}
            aria-label={toast.action.label}
          >
            {toast.action.label}
          </button>
        )}

        <button className={styles.toastClose} onClick={handleClose} aria-label="Close notification">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Progress bar for timed toasts */}
      {toast.duration && toast.duration > 0 && (
        <div className={styles.toastProgressContainer}>
          <div
            className={styles.toastProgress}
            style={{
              animationDuration: `${toast.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
};
