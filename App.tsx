
import React from 'react';
import Header from './components/common/Header';
import { FinancialProvider } from './contexts/FinancialContext';
import { PlanProvider } from './contexts/PlanContext';
import { BrandingProvider } from './contexts/BrandingContext';
import ClientePanel from './components/panels/ClientePanel';

// This component now effectively acts as the root page for unauthenticated users.
// In a real Next.js app, this would be `app/page.tsx`.

const App: React.FC = () => {
  // Mocking the behavior of having different views.
  // In a real app, this would be handled by Next.js routing.

  const renderView = () => {
    // In this new structure, only the ClientePanel is shown by default.
    // Vendedor and Admin panels are behind authentication and routing.
    return <ClientePanel />;
  };

  return (
    <PlanProvider>
      <FinancialProvider>
        <BrandingProvider>
          <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* The Header would now fetch user session data */}
            {/* FIX: The Header component no longer accepts activeView or setActiveView props. */}
            <Header />
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
