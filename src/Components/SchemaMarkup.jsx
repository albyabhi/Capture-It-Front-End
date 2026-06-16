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

// ============================================
// FILE: SchemaMarkup.jsx
// PURPOSE: Adds SEO structured data (JSON-LD) to help search engines understand the page
// HOW IT WORKS:
//   1. Uses react-helmet to inject a <script type="application/ld+json"> tag into the HTML head
//   2. The JSON-LD data describes the page as a "WebPage" with name, description, and URL
//   3. Includes a "CreateAction" pointing to the create-room page
//   4. Adds publisher info (organization name and website)
// CONNECTS TO: react-helmet library, rendered in App.jsx (appears on every page)
// USER IMPACT: Helps Google and other search engines understand what the app does,
//   which improves search rankings and can show rich results in search pages.
// ============================================
