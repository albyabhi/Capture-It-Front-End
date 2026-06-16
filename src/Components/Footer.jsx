import logo from '../assets/capture-it-logo.png';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/30 bg-neu-bg">
      <div className="max-w-3xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <img src={logo} alt="Capture-It" className="h-7 w-auto opacity-60" />
        <span className="text-xs text-neu-text-muted">
          &copy; {new Date().getFullYear()} Capture-It
        </span>
        <span className="text-xs text-neu-text-muted">
          Made for events that matter.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

// ============================================
// FILE: Footer.jsx
// PURPOSE: Page footer showing logo, copyright, and tagline
// HOW IT WORKS:
//   - Renders a simple footer section at the bottom of the page
//   - Displays the Capture-It logo (small, semi-transparent)
//   - Shows the current year and "Capture-It" copyright text
//   - Shows the tagline "Made for events that matter."
// CONNECTS TO: capture-it-logo.png asset
// USER IMPACT: Provides branding and copyright info at the bottom of the home page.
// ============================================
