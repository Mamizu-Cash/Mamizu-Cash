import React from 'react';
import styles from './Spinner.module.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large' | 'extraLarge' | 'huge';
  variant?: 'default' | 'ring' | 'dots' | 'pulse' | 'gradient' | 'bitcoin';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral' | 'white';
  speed?: 'slow' | 'normal' | 'fast';
  glowing?: boolean;
  wobble?: boolean;
  interactive?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ 
    size = 'medium',
    variant = 'ring',
    color = 'primary',
    speed = 'normal',
    glowing = false,
    wobble = false,
    interactive = false,
    className = '', 
    'aria-label': ariaLabel = 'Loading...',
    ...props 
  }, ref) => {
    
    const spinnerClasses = [
      styles.spinner,
      styles[size],
      styles[variant],
      styles[color],
      speed !== 'normal' && styles[speed],
      glowing && styles.glowing,
      wobble && styles.wobble,
      interactive && styles.interactive,
      className
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={spinnerClasses}
        role="status"
        aria-live="polite"
        aria-label={ariaLabel}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';