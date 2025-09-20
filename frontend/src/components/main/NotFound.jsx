import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      {/* Animated Icon */}
      <div className="animate-bounce text-violet-600 text-6xl mb-4">
        <FaShoppingCart />
      </div>

      {/* 404 Text */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Go Home Button */}
      <button
        onClick={() => navigate('/')}
        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;