import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ImageViewer = ({ open, onClose, images, currentIndex = 0, onImageChange }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
    if (onImageChange) onImageChange(newIndex);
  }, [activeIndex, images.length, onImageChange]);

  const handleNext = useCallback(() => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    if (onImageChange) onImageChange(newIndex);
  }, [activeIndex, images.length, onImageChange]);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStart(null);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, handlePrev, handleNext]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
        aria-label="Close image viewer"
      >
        <X size={22} />
      </button>

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Image */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <img
          src={images[activeIndex]}
          alt={`Photo ${activeIndex + 1} of ${images.length}`}
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 z-10 text-white/90 text-xs sm:text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

ImageViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  currentIndex: PropTypes.number,
  onImageChange: PropTypes.func,
};

export default ImageViewer;

// ============================================
// FILE: ImageViewer.jsx
// PURPOSE: Full-screen lightbox for viewing photos one at a time with navigation
// HOW IT WORKS:
//   1. When opened, shows a dark blurred backdrop covering the entire screen
//   2. Displays the current image in the center, fitting within the viewport
//   3. Shows prev/next arrow buttons if there are multiple images
//   4. Keyboard support: Escape closes, ArrowLeft/ArrowRight navigate
//   5. Touch support: swipe left/right (50px threshold) to navigate
//   6. Shows image counter ("1 / 5") at the bottom
//   7. Locks body scroll when open, unlocks when closed
// CONNECTS TO: Album (parent that opens/closes this), Lucide icons (X, ChevronLeft, ChevronRight)
// USER IMPACT: Users can browse through all event photos in full-screen mode,
//   like a slideshow. Works with both keyboard (desktop) and touch (mobile).
// ============================================
