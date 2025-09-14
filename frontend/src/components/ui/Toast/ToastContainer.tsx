import type React from "react";
import { createPortal } from "react-dom";
import { Toast } from "./Toast";
import styles from "./ToastContainer.module.css";
import { useToast } from "./ToastContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className={styles.toastContainer} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>,
    document.body,
  );
};
