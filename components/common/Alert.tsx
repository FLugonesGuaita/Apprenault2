import React from 'react';

const Alert = ({ message, type = 'warning' }) => {
  const colorClasses = {
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    success: 'bg-green-100 border-green-400 text-green-700',
  };

  return (
    <div className={`border-l-4 p-4 ${colorClasses[type]}`} role="alert">
      <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
      <p>{message}</p>
    </div>
  );
};

export default Alert;
