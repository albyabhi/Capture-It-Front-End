import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import PDFAlbum from "./PDFAlbum";

const PDFDownloadModal = ({ images, eventName, onClose }) => {
  return (
    <div className="neu-pdf-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[1100px] h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Album PDF Preview
          </h3>
          <div className="flex items-center gap-4">
            <PDFDownloadLink
              document={<PDFAlbum images={images} eventName={eventName} />}
              fileName={`${eventName}-album.pdf`}
            >
              {({ loading }) => (
                <button
                  className="neu-btn-accent px-4 py-2 text-sm font-medium text-white"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>
            <button
              onClick={onClose}
              className="neu-icon-btn w-9 h-9"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <PDFAlbum images={images} eventName={eventName} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

PDFDownloadModal.propTypes = {
  images: PropTypes.array.isRequired,
  eventName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PDFDownloadModal;
