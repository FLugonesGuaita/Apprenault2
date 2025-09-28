import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import Header from './components/common/Header';
import { FinancialProvider } from './contexts/FinancialContext';
import { PlanProvider } from './contexts/PlanContext';
import { BrandingProvider } from './contexts/BrandingContext';
import ClientePanel from './components/panels/ClientePanel';
import VendedorPanel from './components/panels/VendedorPanel';
import AdminPanel from './components/panels/AdminPanel';
import LoginPage from './components/auth/LoginPage';
import AccessDenied from './components/common/AccessDenied';
import { supabase } from './lib/supabase/client';
import type { UserRole } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const path = window.location.pathname;
    const userRole = (session?.user?.user_metadata?.role as UserRole) || 'CLIENTE';

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
        return <ClientePanel />;
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
