import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { fetchImages } from "../Store/albumSlice";
import {
  Box,
  Typography,
  CircularProgress,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

const Album = ({ eventCode }) => {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.album);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  // Local state to store user data
  const [userNames, setUserNames] = useState({});

  // Fetch user data by user ID and update the state
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/user/fetch-by-id/${userId}`);
      if (response.ok) {
        const { user } = await response.json();
        setUserNames((prev) => ({ ...prev, [userId]: user.fullName }));
      } else {
        console.error(`Failed to fetch user data for ID: ${userId}`);
      }
    } catch (error) {
      console.error(`Error fetching user data for ID: ${userId}`, error);
    }
  };

  useEffect(() => {
    if (eventCode) {
      // Fetch images for the event
      dispatch(fetchImages(eventCode));
    }
  }, [eventCode, dispatch]);

  useEffect(() => {
    if (images.length > 0) {
      // Fetch user data for each unique user ID in images
      const uniqueUserIds = [...new Set(images.map((image) => image.user._id))];
      uniqueUserIds.forEach((userId) => {
        if (!userNames[userId]) {
          fetchUserData(userId);
        }
      });
    }
  }, [images, userNames]);

  // Media query breakpoints for responsive columns
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));

  // Determine the number of columns based on screen size
  const getColumns = () => {
    if (isXs) return 1;
    if (isSm) return 1;
    if (isMd) return 2;
    if (isLg) return 3;
    return 3; // Default for larger screens
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "20px" }}>
      {/* Display images in an ImageList */}
      {images.length > 0 ? (
        <ImageList
          sx={{ width: "100%", height: "auto" }}
          cols={getColumns()}
          gap={10}
        >
          {images.map((image) => (
            <ImageListItem key={image._id}>
              <img
                src={image.image_url}
                alt={`Uploaded by user ${image.user._id}`}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow here
                }}
              />
              <ImageListItemBar
                title={`Captured by ${
                  userNames[image.user._id] || "Loading..."
                }`}
                subtitle={new Date(image.timestamp).toLocaleString()}
              />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No images found for this event.
        </Typography>
      )}
    </Box>
  );
};

Album.propTypes = {
  eventCode: PropTypes.string.isRequired,
};

export default Album;
