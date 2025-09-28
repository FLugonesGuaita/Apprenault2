'use client';

import React from 'react';
import { supabase } from '../../lib/supabase/client.ts';
import Button from './Button.tsx';
import { resolvePath } from '../../utils/path.ts';

export default function LogoutButton() {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      window.location.href = resolvePath('/');
    }
  };

  return (
    <Button variant="secondary" onClick={handleSignOut}>
      Cerrar Sesión
    </Button>
  );
}