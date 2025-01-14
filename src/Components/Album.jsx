// src/components/Album.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchImages } from '../Store/albumSlice';
import { Grid, Box, Typography, CircularProgress } from '@mui/material';

const Album = ({ eventCode }) => {
  const dispatch = useDispatch();
  const { images, loading, error } = useSelector((state) => state.album);
  console.log(images);
  useEffect(() => {
    if (eventCode) {
      dispatch(fetchImages(eventCode));
    }
  }, [eventCode, dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container >
        {images.length > 0 ? (
          images.map((image) => (
            <Grid item xs={12} sm={6} md={4} key={image._id} >
              <Box sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                <img
                  src={image.image_url}
                  alt="Uploaded"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ padding: '10px' }}>
                  <Typography variant="body2" fontWeight="bold">
                    {image.user.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(image.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">No images found for this event.</Typography>
        )}
      </Grid>
    </Box>
  );
};

Album.propTypes = {
  eventCode: PropTypes.string.isRequired,
};

export default Album;
