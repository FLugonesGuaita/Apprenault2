import React from 'react';

const Card = ({ children, className = '', title, isFeatured = false }) => {
  const borderClass = isFeatured ? 'border-renault-yellow border-2' : 'border-gray-200 border';
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${borderClass} ${className}`}>
      {title && (
        <div className={`p-4 ${isFeatured ? 'bg-renault-yellow text-renault-dark' : 'bg-gray-50'}`}>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      )}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
