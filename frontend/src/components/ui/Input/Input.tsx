import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  state?: 'default' | 'error' | 'success';
  fullWidth?: boolean;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    variant = 'primary', 
    size = 'medium', 
    state = 'default',
    fullWidth = true,
    className = '', 
    disabled = false,
    ...props 
  }, ref) => {
    const inputClasses = [
      styles.input,
      styles[variant],
      styles[size],
      state !== 'default' && styles[state],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ');

    return (
      <input
        ref={ref}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';