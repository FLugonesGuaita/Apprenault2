'use client';

import React from 'react';
import { supabase } from '../../lib/supabase/client';
import Button from './Button';

export default function LogoutButton() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      Cerrar Sesión
    </Button>
  );
}
