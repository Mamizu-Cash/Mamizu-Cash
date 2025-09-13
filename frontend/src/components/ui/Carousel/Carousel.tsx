import React, { useState, useEffect, useCallback, useRef, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import styles from './Carousel.module.css';

// =================================================================
// CAROUSEL TEMPLATE COMPONENT - Structured content for carousel slides
// =================================================================
export interface CarouselTemplateProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode; // description content
  className?: string;
}

export const CarouselTemplate: React.FC<CarouselTemplateProps> = ({
  icon,
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`${styles.templateSlide} ${className}`}>
      {icon && (
        <div className={styles.carouselIcon}>
          {icon}
        </div>
      )}
      <Text
        variant="label"
        weight="semibold"
        color="primary"
        align="center"
        className={styles.carouselTitle}
      >
        {title}
      </Text>
      <Text
        variant="bodySmall"
        color="secondary"
        align="center"
        className={styles.carouselDescription}
      >
        {children}
      </Text>
    </div>
  );
};

// =================================================================
// MAIN CAROUSEL COMPONENT - Transparent Container
// =================================================================
export interface CarouselProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnInteraction?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  size?: 'small' | 'medium' | 'large';
  onSlideChange?: (index: number) => void;
}

export const Carousel: React.FC<CarouselProps> & {
  Template: typeof CarouselTemplate;
} = ({
  children,
  className = '',
  autoPlay = true,
  autoPlayInterval = 5000, // 5 seconds as specified
  pauseOnInteraction = 10000, // 10 seconds pause after user interaction
  showIndicators = true,
  showArrows = false,
  size = 'medium',
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<number | null>(null);

  // Convert children to array for consistent handling
  const slides = React.useMemo(() => {
    const childArray = Children.toArray(children);
    
    // If children is already a flat array, use it directly
    // If it's nested arrays, flatten them
    const flattenedChildren: React.ReactNode[] = [];
    
    childArray.forEach(child => {
      if (Array.isArray(child)) {
        flattenedChildren.push(...child);
      } else {
        flattenedChildren.push(child);
      }
    });
    
    return flattenedChildren.filter(child => child !== null && child !== undefined);
  }, [children]);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (!autoPlay || slides.length <= 1) return;
    
    autoPlayRef.current = window.setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, slides.length, isPaused]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  const pauseAutoPlay = useCallback(() => {
    setIsPaused(true);
    stopAutoPlay();
    
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    pauseTimeoutRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, pauseOnInteraction);
  }, [pauseOnInteraction]);

  // Handle slide change
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return;
    
    setCurrentSlide(index);
    onSlideChange?.(index);
    if (autoPlay) {
      pauseAutoPlay();
    }
  }, [slides.length, onSlideChange, autoPlay, pauseAutoPlay]);

  // Navigation functions
  const goToPrevSlide = useCallback(() => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
  }, [currentSlide, slides.length, goToSlide]);

  const goToNextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }, [currentSlide, slides.length, goToSlide]);

  // Setup auto-play
  useEffect(() => {
    startAutoPlay();
    return () => {
      stopAutoPlay();
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [startAutoPlay, stopAutoPlay]);

  // Restart auto-play when pause ends
  useEffect(() => {
    if (!isPaused && autoPlay) {
      startAutoPlay();
    }
  }, [isPaused, autoPlay, startAutoPlay]);

  // Reset current slide if slides change and current index is out of bounds
  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const carouselClasses = [
    styles.carousel,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className={carouselClasses}>
      {/* Slides Content */}
      <div className={styles.carouselContent}>
        {slides.map((slide, index) => (
          <div
            key={`slide-${index}`}
            className={`${styles.carouselSlide} ${
              index === currentSlide ? styles.active : ''
            }`}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {(showIndicators || showArrows) && slides.length > 1 && (
        <div className={styles.carouselControls}>
          {/* Left Arrow */}
          {showArrows && (
            <IconButton
              onClick={goToPrevSlide}
              className={styles.carouselArrow}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </IconButton>
          )}

          {/* Indicators */}
          {showIndicators && (
            <div className={styles.carouselIndicators}>
              {slides.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  className={`${styles.carouselDot} ${
                    index === currentSlide ? styles.active : ''
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}

          {/* Right Arrow */}
          {showArrows && (
            <IconButton
              onClick={goToNextSlide}
              className={styles.carouselArrow}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

// Attach the Template component as a static property
Carousel.Template = CarouselTemplate;

export default Carousel;