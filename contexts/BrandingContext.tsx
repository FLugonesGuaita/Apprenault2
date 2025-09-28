import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const BrandingContext = createContext(undefined);

export const BrandingProvider = ({ children }) => {
  const [logo, setLogo] = useLocalStorage('renault-logo', null);

  return (
    <BrandingContext.Provider value={{ logo, setLogo }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
