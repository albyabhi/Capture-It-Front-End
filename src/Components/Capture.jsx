import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import cameraLogo from "../assets/camera.png";
import folderLogo from "../assets/folder.png";
import saveLogo from "../assets/save.png";

const Capture = ({ eventCode, refreshImages }) => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const fileSelectRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const guestToken = localStorage.getItem("guestToken");
  const authToken = localStorage.getItem("authToken");

  if (!guestToken) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-10 gap-4">
        <p className="text-base text-neu-text-muted text-center">
          {authToken
            ? "Sign in as a guest to upload your photos"
            : "Sign in to upload your photos"}
        </p>
        <button
          onClick={() => navigate(`/user/${eventCode}`)}
          className="neu-btn-accent px-6 py-3 text-white font-medium text-sm"
        >
          {authToken ? "Sign In as Guest" : "Sign In"}
        </button>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => ({
          file,
          name: file.name,
          size: file.size,
        }));
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const openCamera = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const openFileSelector = (e) => {
    e.stopPropagation();
    fileSelectRef.current?.click();
  };

  const sendImagesToBackend = async () => {
    if (!photos.length || isSaving) return;

    setIsSaving(true);
    const formData = new FormData();
    photos.forEach((photo) => formData.append("images", photo.file));
    formData.append("eventCode", eventCode);

    try {
      await axios.post(`${apiUrl}/image/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${guestToken}`,
        },
      });
      setPhotos([]);
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      refreshImages();
    } catch (error) {
      console.error("Failed to upload images", error);
      setUploadError("Failed to upload images, please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 py-5 gap-4 relative">
      {alertVisible && (
        <div className="neu-alert-success absolute top-5 z-10 w-full max-w-md text-center">
          Image saved!
        </div>
      )}
      {uploadError && (
        <div className="neu-alert-error w-full max-w-md text-center">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 sm:gap-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <button
            onClick={openCamera}
            className="neu-icon-btn w-[60px] h-[60px]"
            aria-label="Open camera"
          >
            <img src={cameraLogo} alt="" className="w-[30px] h-[30px]" />
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
            multiple
            capture="camera"
          />
          <span className="text-sm text-neu-text-muted mt-2">
            Camera
          </span>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={openFileSelector}
            className="neu-icon-btn w-[60px] h-[60px]"
            aria-label="Choose from gallery"
          >
            <img src={folderLogo} alt="" className="w-[30px] h-[30px]" />
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileSelectRef}
            multiple
          />
          <span className="text-sm text-neu-text-muted mt-2">
            Choose from Gallery
          </span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="w-full max-w-[600px] mt-5">
          <h4 className="text-base font-medium text-neu-accent mb-4">
            Captured Images
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="neu-raised-sm overflow-hidden">
                <img
                  src={URL.createObjectURL(photo.file)}
                  alt={`Captured photo ${index + 1}: ${photo.name}`}
                  loading="lazy"
                  className="w-full h-auto rounded-[8px]"
                />
                <div className="px-2 py-1">
                  <p className="text-xs text-neu-text m-0 truncate">
                    {photo.name}
                  </p>
                  <p className="text-xs text-neu-text-muted m-0">
                    {Math.round(photo.size / 1024)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center mt-4">
            <button
              onClick={sendImagesToBackend}
              disabled={isSaving}
              className="neu-icon-btn w-[60px] h-[60px] disabled:opacity-50"
              aria-label={isSaving ? "Saving photos" : "Save all photos"}
            >
              {isSaving ? (
                <div className="neu-spinner w-[30px] h-[30px] border-2"></div>
              ) : (
                <img src={saveLogo} alt="" className="w-[30px] h-[30px]" />
              )}
            </button>
            <span className="text-sm text-neu-text-muted mt-2">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

Capture.propTypes = {
  eventCode: PropTypes.string.isRequired,
  refreshImages: PropTypes.func.isRequired,
};

export default Capture;

// ============================================
// FILE: Capture.jsx
// PURPOSE: Camera/gallery upload component for taking or selecting photos to upload
// HOW IT WORKS:
//   1. Shows two icon buttons: Camera (opens device camera) and Gallery (opens file picker)
//   2. When user selects/takes photos, they appear in a preview grid showing name and size
//   3. User can select multiple photos before uploading
//   4. "Save" button sends all selected photos to the server as FormData with JWT auth
//   5. On success, clears the preview and refreshes the album to show new photos
//   6. Shows success/error alerts briefly after upload
// CONNECTS TO: backend /image/upload API, Album (refreshImages callback), camera/folder/save icons
// USER IMPACT: Users tap the camera icon to take a photo or the folder icon to pick from gallery.
//   After selecting photos, they tap Save to upload everything to the shared event album.
// ============================================
