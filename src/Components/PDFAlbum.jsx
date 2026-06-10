import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
  },
  header: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 15,
    fontFamily: "Helvetica",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageContainer: {
    width: "30%",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "contain",
  },
  caption: {
    fontSize: 7,
    color: "#999999",
    marginTop: 4,
    fontFamily: "Helvetica",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 15,
    right: 20,
    fontSize: 8,
    color: "#aaaaaa",
    fontFamily: "Helvetica",
  },
});

const IMAGES_PER_PAGE = 6;

const PDFAlbum = ({ images, eventName }) => {
  const pages = [];
  for (let i = 0; i < images.length; i += IMAGES_PER_PAGE) {
    pages.push(images.slice(i, i + IMAGES_PER_PAGE));
  }

  return (
    <Document>
      {pages.map((pageImages, pageIndex) => (
        <Page key={pageIndex} size={[841.89, 595.28]} style={styles.page}>
          <Text style={styles.header}>{eventName} — Album</Text>
          <View style={styles.grid}>
            {pageImages.map((image, imgIndex) => (
              <View key={imgIndex} style={styles.imageContainer}>
                <Image src={image.image_url} style={styles.image} />
                <Text style={styles.caption}>
                  {image.user?.fullName || "Unknown"}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.footer}>
            Page {pageIndex + 1} of {Math.ceil(images.length / IMAGES_PER_PAGE)}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

PDFAlbum.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      image_url: PropTypes.string.isRequired,
      user: PropTypes.shape({
        fullName: PropTypes.string,
      }),
    })
  ).isRequired,
  eventName: PropTypes.string.isRequired,
};

export default PDFAlbum;
