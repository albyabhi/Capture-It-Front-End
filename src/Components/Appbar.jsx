import logo from '../assets/capture-it-logo.png';
import { useNavigate } from 'react-router-dom';

const Appbar = () => {
  const navigate = useNavigate();

  const handleHomeNav = () => {
    navigate('/');
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-neu-bg/80 backdrop-blur-sm">
        <div className="flex items-center justify-center py-3 px-4">
          <div
            className="w-[200px] sm:w-[250px] md:w-[350px] lg:w-[400px] cursor-pointer"
            onClick={handleHomeNav}
          >
            <img
              src={logo}
              alt="Capture It Logo"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="h-[72px]" />
    </>
  );
};

export default Appbar;
