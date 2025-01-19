import { Helmet } from 'react-helmet';

const SchemaMarkup = () => (
  <Helmet>
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Capture-It",
          "description": "Capture and create personalized photo albums for any event, from weddings to family gatherings. Upload photos and make memories unforgettable.",
          "url": "https://capture-it-albyabhi.netlify.app/",
          "potentialAction": {
            "@type": "CreateAction",  // Corrected action type
            "target": "https://capture-it-albyabhi.netlify.app/create-room",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Capture-It",
            "url": "https://albyabhi.netlify.app/"
          }
        }
      `}
    </script>
  </Helmet>
);

// Ensure it is exported as default
export default SchemaMarkup;
