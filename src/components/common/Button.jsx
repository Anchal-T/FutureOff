import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false, 
  size = 'md',
  variant = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm font-medium',
    md: 'px-5 py-2.5 text-sm font-semibold',
    lg: 'px-7 py-3.5 text-base font-semibold'
  };

  const variantClasses = {
    primary: 'btn-gradient text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl'
  };

  const disabledClasses = 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none transform-none';

  return (
    <button
      className={`rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${sizeClasses[size]} ${
        disabled ? disabledClasses : variantClasses[variant]
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;