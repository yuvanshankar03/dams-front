import React from 'react';
import { useNavigate } from 'react-router-dom';
import DesignerImage from '../images/background.png'; // Import the image file

const LandingPage = () => {
  const navigate = useNavigate();

  const handleRoute = () => {
    navigate('register');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        position: 'relative',
      }}
    >
      {/* Background image with blur effect */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${DesignerImage})`,
          backgroundSize: 'cover',
          filter: 'blur(3px)',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-4xl font-bold mb-4 hover:text-black">Department Asset Management System</h1>
        <p className="mb-8 font-semibold hover:text-black">Efficiently manage and track your departmental assets.</p>
        <button
          onClick={handleRoute}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:text-green-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
