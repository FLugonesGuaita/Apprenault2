'use client';

import React from 'react';
import { pb } from '../../lib/pocketbase/client';
import Button from './Button';

// Este componente proporciona un botón para que los usuarios cierren sesión.
// Utiliza el cliente de PocketBase y recarga la página en caso de éxito.
export default function LogoutButton() {
  const handleSignOut = () => {
    try {
      pb.authStore.clear(); // Limpia el token de autenticación
      // Redirige a la página de inicio y recarga para limpiar el estado de la aplicación.
      window.location.href = '/';
    } catch (error) {
      console.error('An unexpected error occurred during sign out:', error);
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      Cerrar Sesión
    </Button>
  );
}