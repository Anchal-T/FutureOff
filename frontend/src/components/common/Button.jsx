import React from 'react';

const Button = ({ children, onClick, className, disabled }) => (
  <button
    className={`px-4 py-2 rounded font-medium ${className} ${
      disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;