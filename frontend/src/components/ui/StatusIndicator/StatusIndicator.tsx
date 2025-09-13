import React from 'react';
import styles from './StatusIndicator.module.css';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'online' | 'busy' | 'away' | 'offline' | 'signing' | 'completed' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  position?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
  absolute?: boolean;
  pulsing?: boolean;
  blinking?: boolean;
  glowing?: boolean;
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ 
    status = 'online',
    size = 'medium',
    position,
    absolute = false,
    pulsing = false,
    blinking = false,
    glowing = false,
    interactive = false,
    className = '', 
    children,
    onClick,
    ...props 
  }, ref) => {
    
    const statusClasses = [
      styles.statusIndicator,
      styles[size],
      styles[status],
      absolute && styles.absolute,
      position && styles[position],
      pulsing && styles.pulsing,
      blinking && styles.blinking,
      glowing && styles.glowing,
      interactive && styles.interactive,
      children && styles.withContent,
      className
    ].filter(Boolean).join(' ');

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && onClick) {
        onClick(e);
      }
    };

    // Generate appropriate aria-label based on status
    const getStatusLabel = (status: string): string => {
      const statusLabels = {
        online: 'オンライン',
        busy: '取り込み中',
        away: '離席中',
        offline: 'オフライン',
        signing: '署名中',
        completed: '完了',
        error: 'エラー',
        warning: '警告',
        info: '情報'
      };
      return statusLabels[status as keyof typeof statusLabels] || status;
    };

    return (
      <div
        ref={ref}
        className={statusClasses}
        onClick={handleClick}
        role={interactive ? 'button' : 'status'}
        tabIndex={interactive ? 0 : undefined}
        aria-label={`ステータス: ${getStatusLabel(status)}`}
        title={getStatusLabel(status)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';