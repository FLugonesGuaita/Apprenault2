
import React, { useState, useEffect } from 'react';
import Header from './components/common/Header.jsx';
import { FinancialProvider } from './contexts/FinancialContext.jsx';
import { PlanProvider } from './contexts/PlanContext.jsx';
import { BrandingProvider } from './contexts/BrandingContext.jsx';
import ClientePanel from './components/panels/ClientePanel.jsx';
import VendedorPanel from './components/panels/VendedorPanel.jsx';
import AdminPanel from './components/panels/AdminPanel.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import AccessDenied from './components/common/AccessDenied.jsx';
import { supabase } from './lib/supabase/client.js';
import { getAppPath } from './utils/path.js';

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle SPA redirect from 404.html on services like GitHub Pages
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      window.history.replaceState(null, '', redirectPath);
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderView = () => {
    if (loading) {
      return <div className="text-center p-8">Cargando...</div>;
    }
    
    // Use getAppPath to handle running in subdirectories (like GitHub pages)
    const path = getAppPath(window.location.pathname);
    const userRole = session?.user?.user_metadata?.role || 'CLIENTE';
    
    switch (path) {
      case '/login':
        return <LoginPage />;
      case '/vendedor':
        if (userRole === 'VENDEDOR' || userRole === 'ADMIN') {
          return <VendedorPanel />;
        }
        return <AccessDenied />;
      case '/admin':
        if (userRole === 'ADMIN') {
          return <AdminPanel />;
        }
        return <AccessDenied />;
      case '/':
      default:
        // FIX: Pass clientDetails prop to ClientePanel.
        return <ClientePanel clientDetails={{}} />;
    }
  };

  return (
    <PlanProvider>
      <FinancialProvider>
        <BrandingProvider>
          <div className="min-h-screen bg-gray-50 text-gray-800">
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