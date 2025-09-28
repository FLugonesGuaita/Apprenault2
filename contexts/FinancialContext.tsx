import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { DEFAULT_FINANCIAL_PARAMS } from '../constants.js';

const FinancialContext = createContext(undefined);

export const FinancialProvider = ({ children }) => {
  const [params, setParams] = useLocalStorage('renault-financial-params', DEFAULT_FINANCIAL_PARAMS);

  return (
    <FinancialContext.Provider value={{ params, setParams }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialParams = () => {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error('useFinancialParams must be used within a FinancialProvider');
  }
  return context;
};
