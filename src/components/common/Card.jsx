import React from 'react';

const Card = ({ children, title, className = "" }) => (
  <div className={`card ${className}`}>
    {title && (
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {title}
      </h2>
    )}
    {children}
  </div>
);

export default Card;