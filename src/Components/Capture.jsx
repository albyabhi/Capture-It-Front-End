import { useRef, useState } from "react";
import { Box, Grid, Typography, Alert, IconButton } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import saveLogo from "../assets/save.png";
import cameraLogo from "../assets/camera.png";
import folderLogo from "../assets/folder.png";

const Capture = ({ eventCode, refreshImages }) => {
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const fileSelectRef = useRef(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("No token found");
    return null; // Or redirect to login
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

  const openCamera = () => {
    fileInputRef.current?.click();
  };

  const openFileSelector = () => {
    fileSelectRef.current?.click();
  };

  const sendImagesToBackend = async () => {
    if (!photos.length || loading) return;

    setLoading(true);
    const formData = new FormData();
    photos.forEach((photo) => formData.append("images", photo.file));
    formData.append("eventCode", eventCode);

    try {
      await axios.post(`${apiUrl}/image/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
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
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", gap: "16px" }}>
      {alertVisible && (
        <Alert severity="success" sx={{ position: "absolute", top: 20, zIndex: 1, width: "30%" }}>
          Image saved!
        </Alert>
      )}
      {uploadError && <Alert severity="error">{uploadError}</Alert>}

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton color="primary" onClick={openCamera} sx={{ width: '60px', height: '60px' }}>
              <img src={cameraLogo} alt="camera" style={{ width: '100%' }} />
            </IconButton>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileInputRef} multiple capture="camera" />
            <Typography variant="caption" color="textSecondary" sx={{ marginTop: '8px' }}>
              Camera
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton color="secondary" onClick={openFileSelector} sx={{ width: '60px', height: '60px' }}>
              <img src={folderLogo} alt="folder" style={{ width: '100%' }} />
            </IconButton>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={fileSelectRef} multiple />
            <Typography variant="caption" color="textSecondary" sx={{ marginTop: '8px' }}>
              Choose from Gallery
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {photos.length > 0 && (
        <Box sx={{ width: "100%", maxWidth: "600px", marginTop: "20px" }}>
          <Typography variant="h6" color="primary" sx={{ marginBottom: "16px" }}>
            Captured Images
          </Typography>
          <ImageList sx={{ width: "100%", height: "auto" }} cols={3}>
            {photos.map((photo, index) => (
              <ImageListItem key={index}>
                <img src={URL.createObjectURL(photo.file)} alt={`Captured ${index + 1}`} loading="lazy" style={{ borderRadius: "8px" }} />
                <ImageListItemBar title={photo.name} subtitle={`Size: ${Math.round(photo.size / 1024)} KB`} />
              </ImageListItem>
            ))}
          </ImageList>

          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton color="success" onClick={sendImagesToBackend} disabled={loading} sx={{ width: '60px', height: '60px' }}>
                <img src={saveLogo} alt="save" style={{ width: '100%' }} />
              </IconButton>
              <Typography variant="caption" color="textSecondary" sx={{ marginTop: '8px' }}>
                Save
              </Typography>
            </Box>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

Capture.propTypes = {
  eventCode: PropTypes.string.isRequired,
  refreshImages: PropTypes.func.isRequired,
};

export default Capture;
