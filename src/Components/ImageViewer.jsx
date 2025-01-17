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
      }}
    >
      <DialogActions sx={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
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
