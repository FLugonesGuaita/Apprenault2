import React from 'react';

const Select = ({ label, id, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-renault-dark bg-renault-gray text-white focus:outline-none focus:ring-renault-yellow focus:border-renault-yellow sm:text-sm rounded-md"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;