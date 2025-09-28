
import React, { createContext, useContext } from 'react';
import type { FinancialParams } from '../types.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { DEFAULT_FINANCIAL_PARAMS } from '../constants.ts';

interface FinancialContextType {
  params: FinancialParams;
  setParams: React.Dispatch<React.SetStateAction<FinancialParams>>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [params, setParams] = useLocalStorage<FinancialParams>('renault-financial-params', DEFAULT_FINANCIAL_PARAMS);

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