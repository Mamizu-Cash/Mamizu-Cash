import React, { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { BaseButton } from "../BaseButton/BaseButton";
import type { BaseButtonProps } from "../BaseButton/BaseButton";
import styles from "./CopyButton.module.css";

export interface CopyButtonProps extends BaseButtonProps {
  textToCopy?: string;
  onCopySuccess?: (text: string) => void;
  onCopyError?: (error: Error) => void;
  successMessage?: string;
  resetDelay?: number;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      textToCopy = "",
      onCopySuccess,
      onCopyError,
      successMessage = "コピー済",
      resetDelay = 2000,
      className = "",
      children = "コピー",
      onClick,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = useState(false);
    const [ripples, setRipples] = useState<
      Array<{ id: number; x: number; y: number }>
    >([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const buttonClasses = [
      styles.copyButton,
      copied && styles.copied,
      copied && styles.success,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // リップル効果
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { id: Date.now(), x, y };
        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
          setRipples((prev) =>
            prev.filter((ripple) => ripple.id !== newRipple.id)
          );
        }, 400);
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        onCopySuccess?.(textToCopy);

        // 指定時間後に元に戻す
        setTimeout(() => {
          setCopied(false);
        }, resetDelay);
      } catch (error) {
        console.error("コピーに失敗しました:", error);
        onCopyError?.(error as Error);
        // フォールバック: 古いブラウザ対応
        try {
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          onCopySuccess?.(textToCopy);

          setTimeout(() => {
            setCopied(false);
          }, resetDelay);
        } catch (fallbackError) {
          onCopyError?.(fallbackError as Error);
        }
      }

      onClick?.(e);
    };

    return (
      <BaseButton
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={buttonClasses}
        onClick={handleCopy}
        {...props}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? successMessage : children}

        {/* リップル効果 */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
          />
        ))}
      </BaseButton>
    );
  }
);

CopyButton.displayName = "CopyButton";
