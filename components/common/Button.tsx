import React from 'react';

// FIX: Made icon prop optional with a default null value to fix type errors.
const Button = ({ children, variant = 'primary', icon = null, ...props }) => {
  const baseClasses = "px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: 'border-transparent text-renault-dark bg-renault-yellow hover:bg-yellow-400 focus:ring-renault-yellow',
    secondary: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-renault-yellow',
    danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {icon}
      {children}
    </button>
  );
};

export default Button;