import React from 'react';
import styles from './Text.module.css';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' | 'caption' | 'code' | 'pre';
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'bodyLarge' | 'bodySmall' | 'label' | 'labelSmall' | 'caption' | 'mono' | 'monoLarge' | 'monoSmall';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'brand' | 'info' | 'success' | 'warning' | 'error' | 'white';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  decoration?: 'underline' | 'lineThrough' | 'noDecoration';
  transform?: 'uppercase' | 'lowercase' | 'capitalize';
  effect?: 'embossed' | 'embossedStrong' | 'glowing';
  truncate?: boolean | 2 | 3;
  className?: string;
  children?: React.ReactNode;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    as = 'p',
    variant = 'body',
    color = 'primary',
    weight,
    align,
    decoration,
    transform,
    effect,
    truncate = false,
    className = '', 
    children,
    ...props 
  }, ref) => {
    const Component = as;
    
    const textClasses = [
      styles.text,
      styles[variant],
      styles[color],
      weight && styles[weight],
      align && styles[align],
      decoration && styles[decoration],
      transform && styles[transform],
      effect && styles[effect],
      truncate === true && styles.truncate,
      truncate === 2 && styles.lineClamp2,
      truncate === 3 && styles.lineClamp3,
      className
    ].filter(Boolean).join(' ');

    return (
      <Component
        ref={ref as any}
        className={textClasses}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';