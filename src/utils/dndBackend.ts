import { HTML5Backend } from 'react-dnd-html5-backend';

// Detect if device supports touch
const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
};

// Detect if device is mobile (currently unused but kept for future use)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Custom backend that chooses the appropriate backend based on device capabilities
export const createCustomBackend = () => {
  // For now, always use HTML5Backend and rely on mobile-drag-drop polyfill
  // This avoids Jest issues with ES modules
  return HTML5Backend;
};

// Initialize mobile drag drop polyfill
export const initializeMobileDragDrop = () => {
  if (typeof window !== 'undefined' && isTouchDevice()) {
    // @ts-ignore
    import('mobile-drag-drop').then(({ polyfill }) => {
      polyfill({
        // Custom drag image
        dragImageCenterOnTouch: true,
        // Enable scroll behavior
        holdToDrag: 200, // Hold for 200ms to start drag
        // Custom drag image
        dragImageTranslateOverride: (event: TouchEvent) => {
          return {
            x: 0,
            y: 0,
            scale: 1.1, // Slightly scale up the drag image
          };
        },
      });
      
      // Prevent default touch behavior that might interfere
      document.addEventListener('touchmove', (e) => {
        // Only prevent default if we're dragging
        if (e.target && (e.target as Element).closest('[data-dnd-draggable]')) {
          e.preventDefault();
        }
      }, { passive: false });
    });
  }
};
