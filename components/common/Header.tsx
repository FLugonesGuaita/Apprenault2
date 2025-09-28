'use client';

import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/client';
import { RenaultLogo } from '../icons/RenaultLogo';
import type { UserRole } from '../../types';
import LogoutButton from './LogoutButton';
import { resolvePath } from '../../utils/path';

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const userRole = (session?.user?.user_metadata?.role as UserRole) || 'CLIENTE';

  const navItems: { role: UserRole, label: string, href: string }[] = [
    { role: 'CLIENTE', label: 'Cliente', href: resolvePath('/') },
  ];

  if (userRole === 'VENDEDOR' || userRole === 'ADMIN') {
    navItems.push({ role: 'VENDEDOR', label: 'Vendedor', href: resolvePath('/vendedor') });
  }
  if (userRole === 'ADMIN') {
    navItems.push({ role: 'ADMIN', label: 'Admin', href: resolvePath('/admin') });
  }

  return (
    <header className="bg-renault-dark shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href={resolvePath('/')} className="flex items-center">
            <RenaultLogo className="h-8 w-auto" />
            <span className="text-white ml-3 text-xl font-bold">Plan Rombo</span>
          </a>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-300 hover:bg-renault-gray hover:text-white`}
              >
                {item.label}
              </a>
            ))}
            {session ? (
              <LogoutButton />
            ) : (
              <a href={resolvePath('/login')} className="px-3 py-2 rounded-md text-sm font-medium bg-renault-yellow text-renault-dark">
                Iniciar Sesión
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;