import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fetchImages } from "../Store/albumSlice";
import ImageViewer from "./ImageViewer";
import PDFDownloadModal from "./PDFDownloadModal";
import { Download } from "lucide-react";

const Album = ({ eventCode }) => {
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state) => state.album);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    if (eventCode) {
      dispatch(fetchImages(eventCode));
    }
  }, [eventCode, dispatch]);

  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 w-full p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="neu-masonry-item mb-5 animate-neu-fade-in">
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            <div className="px-3 py-2">
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && images.length === 0) {
    return (
      <div className="neu-empty-state py-12">
        <p className="text-lg text-neu-text-muted">No photos yet.</p>
        <p className="text-sm text-neu-text-muted mt-1">
          Be the first to capture a moment!
        </p>
      </div>
    );
  }

  const handleImageClick = (imageUrl, index) => {
    setSelectedImageUrl(imageUrl);
    setCurrentIndex(index);
    setOpenImageViewer(true);
  };

  const handleCloseImageViewer = () => {
    setOpenImageViewer(false);
    setSelectedImageUrl("");
  };

  const handleImageChange = (newIndex) => {
    setCurrentIndex(newIndex);
    setSelectedImageUrl(images[newIndex].image_url);
  };

  return (
    <div className="p-5 w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-neu-text">Event Album</h3>
          <span className="neu-btn text-xs px-2.5 py-0.5 text-neu-accent">
            {images.length} {images.length === 1 ? "photo" : "photos"}
          </span>
        </div>
        <button
          onClick={() => setShowPDFModal(true)}
          className="neu-btn-accent px-4 py-2 text-sm font-medium text-white flex items-center gap-2"
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 w-full">
        {images.map((image, index) => (
          <div
            key={image._id}
            className="neu-masonry-item mb-5 cursor-pointer animate-neu-fade-in"
            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
            onClick={() => handleImageClick(image.image_url, index)}
          >
            <img
              src={image.image_url}
              alt={`Photo by ${image.user?.fullName || "a user"}`}
              className="w-full h-auto block"
              loading="lazy"
            />
            <div className="px-3 py-2">
              <p className="text-sm text-neu-text-muted m-0">
                {image.user?.fullName || "Unknown"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <ImageViewer
        open={openImageViewer}
        imageUrl={selectedImageUrl}
        images={images.map((img) => img.image_url)}
        currentIndex={currentIndex}
        onClose={handleCloseImageViewer}
        onImageChange={handleImageChange}
      />

      {/* PDF Modal */}
      {showPDFModal && (
        <PDFDownloadModal
          images={images}
          eventName={eventCode}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </div>
  );
};

Album.propTypes = {
  eventCode: PropTypes.string.isRequired,
};

export default Album;

// ============================================
// FILE: Album.jsx
// PURPOSE: Masonry photo gallery that displays all uploaded event photos in a responsive grid
// HOW IT WORKS:
//   1. Fetches all images for the event from Redux store (via fetchImages thunk)
//   2. Shows skeleton loading placeholders while images load
//   3. Shows "No photos yet" empty state if there are no images
//   4. Renders images in a CSS columns masonry layout (1-4 columns based on screen size)
//   5. Each image shows the photo and the uploader's name below it
//   6. Clicking an image opens a full-screen lightbox (ImageViewer component)
//   7. "Download PDF" button opens a modal with PDF preview and download
// CONNECTS TO: Redux albumSlice (fetchImages), ImageViewer (lightbox), PDFDownloadModal (PDF export)
// USER IMPACT: This is the shared photo wall where users see all event photos together.
//   They can click any photo to view it full-size and navigate between photos.
// ============================================
