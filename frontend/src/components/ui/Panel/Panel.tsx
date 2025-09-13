import React, { type ReactNode } from 'react'
import styles from './Panel.module.css'
export interface PanelProps {
  children: ReactNode
  className?: string
  size?: 'small' | 'medium' | 'large'
  full?: boolean
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  size,
  full = false,
}) => {
  return (
    <div
      className={`${styles.panel} ${size && styles[size]} ${full ? styles.full : ''} ${className}`}
    >
      <div className={styles.highlight}></div>
      {children}
    </div>
  )
}

export default Panel
