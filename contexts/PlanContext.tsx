
import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import type { Plan } from '../types.ts';
import { INITIAL_PLANS } from '../constants.ts';

interface PlanContextType {
  plans: Plan[];
  addPlan: (plan: Omit<Plan, 'id' | 'activo'>) => void;
  updatePlan: (plan: Plan) => void;
  togglePlanStatus: (planId: string) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useLocalStorage<Plan[]>('renault-plans', INITIAL_PLANS);

  const addPlan = (planData: Omit<Plan, 'id' | 'activo'>) => {
    const newPlan: Plan = {
      ...planData,
      id: `plan-${new Date().getTime()}`,
      activo: true,
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (updatedPlan: Plan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const togglePlanStatus = (planId: string) => {
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