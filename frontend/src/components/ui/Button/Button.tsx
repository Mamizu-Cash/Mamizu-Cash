import React from 'react';
import { BaseButton } from '../BaseButton/BaseButton';
import type { BaseButtonProps } from '../BaseButton/BaseButton';
import styles from './Button.module.css';

export interface ButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'groom' | 'bride' | 'timeDisplay';
  size?: 'medium' | 'large';
  icon?: React.ReactNode;
  countdown?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'medium', 
    icon, 
    countdown = false,
    loading = false,
    className = '', 
    children, 
    ...props 
  }, ref) => {
    const buttonClasses = [
      styles.button,
      styles[variant],
      size === 'large' && styles.large,
      countdown && styles.countdown,
      loading && styles.loading,
      className
    ].filter(Boolean).join(' ');

    return (
      <BaseButton
        ref={ref}
        className={buttonClasses}
        loading={loading}
        {...props}
      >
        {icon}
        {children}
      </BaseButton>
    );
  }
);

Button.displayName = 'Button';