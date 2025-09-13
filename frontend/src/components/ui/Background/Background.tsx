import React from 'react';
import styles from './Background.module.css';

/**
 * Background
 * 
 * An animated background component. 
 * - No props, no children.
 * - Should be placed as the first child of a relatively positioned parent.
 * - Applies a ceremonial animated background using CSS, inspired by the card stack mockup.
 */
export const Background: React.FC = () => (
  <div className={styles.background} aria-hidden="true" />
);