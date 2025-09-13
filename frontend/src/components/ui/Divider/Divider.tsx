import React from 'react';
import styles from './Divider.module.css';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'gradient' | 'highlight' | 'dashed' | 'dotted';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'thin' | 'medium' | 'thick';
  spacing?: 'small' | 'medium' | 'large' | 'extraLarge';
  label?: React.ReactNode;
  animated?: boolean;
  className?: string;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ 
    orientation = 'horizontal',
    variant = 'gradient',
    color = 'neutral',
    size = 'thin',
    spacing = 'medium',
    label,
    animated = false,
    className = '', 
    children,
    ...props 
  }, ref) => {
    
    const dividerClasses = [
      styles.divider,
      styles[orientation],
      label ? styles.withLabel : styles[variant],
      styles[color],
      styles[size],
      styles[`spacing${spacing.charAt(0).toUpperCase() + spacing.slice(1)}`],
      animated && styles.animated,
      className
    ].filter(Boolean).join(' ');

    // If label is provided, render as labeled divider
    if (label || children) {
      return (
        <div
          ref={ref as any}
          className={dividerClasses}
          role="separator"
          {...props}
        >
          <span className={styles.labelText}>
            {label || children}
          </span>
        </div>
      );
    }

    // Render as simple divider
    return (
      <hr
        ref={ref}
        className={dividerClasses}
        role="separator"
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';