import React from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  label?: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    variant = 'primary', 
    size = 'medium', 
    label,
    required = false,
    className = '', 
    disabled = false,
    checked = false,
    onChange,
    id,
    ...props 
  }, ref) => {
    const containerClasses = [
      styles.container,
      styles[variant],
      styles[size],
      checked && styles.checked,
      disabled && styles.disabled,
      className
    ].filter(Boolean).join(' ');

    // Generate unique ID if not provided
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <label className={containerClasses} htmlFor={checkboxId}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={styles.hiddenInput}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          {...props}
        />
        <div className={styles.checkbox}>
          <Check className={styles.checkmark} size={size === 'small' ? 10 : size === 'large' ? 14 : 12} />
        </div>
        {label && (
          <span className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';