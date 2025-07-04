import React from 'react';

const Card = ({ children, title }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    {title && <h2 className="text-xl font-semibold mb-2">{title}</h2>}
    {children}
  </div>
);

export default Card;