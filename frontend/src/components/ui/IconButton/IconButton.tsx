import React from 'react';
import { BaseButton } from '../BaseButton/BaseButton';
import type { BaseButtonProps } from '../BaseButton/BaseButton';
import styles from './IconButton.module.css';

export interface IconButtonProps extends BaseButtonProps {
  sent?: boolean;
  children?: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({
    sent = false,
    className = '',
    children,
    ...props
  }, ref) => {
    const buttonClasses = [
      styles.iconButton,
      sent && styles.sent,
      className
    ].filter(Boolean).join(' ');

    return (
      <BaseButton
        ref={ref}
        className={buttonClasses}
        {...props}
      >
        <span className={styles.content}>
          {children}
        </span>
      </BaseButton>
    );
  }
);

IconButton.displayName = 'IconButton';