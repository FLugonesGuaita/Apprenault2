'use client';

import React, { useState, useEffect } from 'react';
import type { Admin, Record } from 'pocketbase';
import { pb } from '../../lib/pocketbase/client';
import { RenaultLogo } from '../icons/RenaultLogo';
import type { UserRole } from '../../types';
import LogoutButton from './LogoutButton';

const Header = () => {
  const [user, setUser] = useState<Record | Admin | null>(pb.authStore.model);

  useEffect(() => {
    // Escucha cambios en el estado de autenticación y actualiza el componente.
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    }, true); // El 'true' invoca el callback inmediatamente

    return () => {
      unsubscribe();
    };
  }, []);
  
  // Asumimos que el rol está guardado en un campo 'role' del modelo de usuario
  const userRole = user ? (user as any).role as UserRole : 'CLIENTE';

  const navItems: { role: UserRole, label: string, href: string }[] = [
    { role: 'CLIENTE', label: 'Cliente', href: '/' },
  ];

  if (userRole === 'VENDEDOR' || userRole === 'ADMIN') {
    navItems.push({ role: 'VENDEDOR', label: 'Vendedor', href: '/vendedor' });
  }
  if (userRole === 'ADMIN') {
    navItems.push({ role: 'ADMIN', label: 'Admin', href: '/admin/vendedores' });
  }

  return (
    <header className="bg-renault-dark shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center">
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
            {pb.authStore.isValid && user ? (
              <LogoutButton />
            ) : (
              <a href="/login" className="px-3 py-2 rounded-md text-sm font-medium bg-renault-yellow text-renault-dark">
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