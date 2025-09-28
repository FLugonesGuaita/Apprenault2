import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { INITIAL_PLANS } from '../constants.js';

const PlanContext = createContext(undefined);

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useLocalStorage('renault-plans', INITIAL_PLANS);

  const addPlan = (planData) => {
    const newPlan = {
      ...planData,
      id: `plan-${new Date().getTime()}`,
      activo: true,
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (updatedPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const togglePlanStatus = (planId) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, activo: !p.activo } : p));
  };

  return (
    <PlanContext.Provider value={{ plans, addPlan, updatePlan, togglePlanStatus }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlans = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlans must be used within a PlanProvider');
  }
  return context;
};
