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
