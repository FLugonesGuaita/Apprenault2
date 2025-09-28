
import React, { useState } from 'react';
import Header from './components/common/Header';
import ClientePanel from './components/panels/ClientePanel';
import VendedorPanel from './components/panels/VendedorPanel';
import AdminPanel from './components/panels/AdminPanel';
import { FinancialProvider } from './contexts/FinancialContext';
import { PlanProvider } from './contexts/PlanContext';
import { BrandingProvider } from './contexts/BrandingContext';
import type { UserRole } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<UserRole>('CLIENTE');

  const renderView = () => {
    switch (activeView) {
      case 'VENDEDOR':
        return <VendedorPanel />;
      case 'ADMIN':
        return <AdminPanel />;
      case 'CLIENTE':
      default:
        return <ClientePanel />;
    }
  };

  return (
    <PlanProvider>
      <FinancialProvider>
        <BrandingProvider>
          <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="p-4 sm:p-6 md:p-8">
              {renderView()}
            </main>
            <footer className="text-center p-4 text-xs text-gray-500">
              <p>Valores estimados. Sujetos a validación comercial y a variaciones de precio/índices.</p>
              <p>&copy; {new Date().getFullYear()} Renault Plan Rombo. Todos los derechos reservados.</p>
            </footer>
          </div>
        </BrandingProvider>
      </FinancialProvider>
    </PlanProvider>
  );
};

export default App;