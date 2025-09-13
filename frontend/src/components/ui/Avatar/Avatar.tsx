import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large' | 'extraLarge' | 'huge';
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
  status?: 'online' | 'busy' | 'offline' | 'away';
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    size = 'medium',
    variant = 'default',
    src,
    alt,
    name,
    initials,
    status,
    interactive = false,
    className = '', 
    children,
    onClick,
    ...props 
  }, ref) => {
    
    // Generate initials from name if not provided
    const getInitials = (fullName?: string, providedInitials?: string): string => {
      if (providedInitials) return providedInitials;
      if (!fullName) return '';
      
      return fullName
        .split(' ')
        .slice(0, 2) // Take first 2 words
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
    };

    const displayInitials = getInitials(name, initials);

    const avatarClasses = [
      styles.avatar,
      styles[size],
      styles[variant],
      interactive && styles.interactive,
      className
    ].filter(Boolean).join(' ');

    const statusClasses = [
      styles.statusIndicator,
      status && styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && onClick) {
        onClick(e);
      }
    };

    const renderContent = () => {
      // If image is provided, render img element
      if (src) {
        return (
          <img 
            src={src} 
            alt={alt || name || 'Avatar'} 
            className={styles.image}
            onError={(e) => {
              // If image fails to load, hide it and show initials/children instead
              e.currentTarget.style.display = 'none';
            }}
          />
        );
      }

      // If children are provided (e.g., emoji, icons), render them
      if (children) {
        return children;
      }

      // Otherwise, render initials
      if (displayInitials) {
        return (
          <span className={styles.initials}>
            {displayInitials}
          </span>
        );
      }

      // Fallback: render a default user icon
      return (
        <span style={{ fontSize: '60%' }}>👤</span>
      );
    };

    return (
      <div
        ref={ref}
        className={avatarClasses}
        onClick={handleClick}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={alt || name || 'Avatar'}
        {...props}
      >
        {renderContent()}
        
        {status && (
          <div 
            className={statusClasses}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';