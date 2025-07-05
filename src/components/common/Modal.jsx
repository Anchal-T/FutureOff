import React from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <Button onClick={onClose} className="mt-4 bg-red-500 hover:bg-red-600">
          Close
        </Button>
      </div>
    </div>
  );
};

export default Modal;