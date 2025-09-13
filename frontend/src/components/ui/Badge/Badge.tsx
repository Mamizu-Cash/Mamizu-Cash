import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'dark';
  outline?: boolean;
  size?: 'small' | 'medium' | 'large';
  count?: boolean;
  pill?: boolean;
  withDot?: boolean;
  pulsing?: boolean;
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    variant = 'default',
    outline = false,
    size = 'medium',
    count = false,
    pill = false,
    withDot = false,
    pulsing = false,
    interactive = false,
    className = '', 
    children,
    onClick,
    ...props 
  }, ref) => {
    
    const badgeClasses = [
      styles.badge,
      styles[size],
      outline ? styles[`outline${variant.charAt(0).toUpperCase() + variant.slice(1)}`] : styles[variant],
      count && styles.count,
      pill && styles.pill,
      withDot && styles.withDot,
      pulsing && styles.pulsing,
      interactive && styles.interactive,
      React.Children.toArray(children).some(child => 
        React.isValidElement(child) && typeof child.type === 'function'
      ) && styles.withIcon,
      className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (interactive && onClick) {
        onClick(e);
      }
    };

    return (
      <span
        ref={ref}
        className={badgeClasses}
        onClick={handleClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';