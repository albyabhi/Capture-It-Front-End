import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Carousel from "react-material-ui-carousel";

const ImageViewer = ({ open, onClose, images }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        margin: 0,
        overflow: "hidden",
        "& .MuiPaper-root": {
          backgroundColor: "transparent", // Make the dialog transparent
          boxShadow: "none", // Remove shadow if necessary
        },
      }}
    >
      <DialogActions
        sx={{
          position: "absolute",
          backgroundColor: "rgba(214, 195, 195, 0.8)",
          top: 0,
          right: 0,
          zIndex: 9999, // Ensure the close button is on top
        }}
      >
        <IconButton color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogActions>
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // Black background for content with transparency
        }}
      >
        <Carousel
          autoPlay={false}
          indicators={false}
          navButtonsAlwaysVisible
          animation="slide"
          interval={5000}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          ))}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

ImageViewer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
};

export default ImageViewer;
