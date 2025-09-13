// BaseButton - 共通のロジックと状態管理のみ
import React from 'react';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: string;
  size?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
}

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ loading = false, disabled, children, onClick, className = '', ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

BaseButton.displayName = 'BaseButton';