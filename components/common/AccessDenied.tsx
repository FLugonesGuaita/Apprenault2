import React from 'react';
import Card from './Card.jsx';
import { resolvePath } from '../../utils/path.js';

const AccessDenied = () => {
  return (
    <div className="container mx-auto max-w-lg text-center">
      <Card title="Acceso Denegado">
        <div className="space-y-4">
          <p className="text-lg">No tienes los permisos necesarios para acceder a esta página.</p>
          <p className="text-gray-600">
            Si crees que esto es un error, por favor contacta al administrador.
          </p>
          <a
            href={resolvePath('/')}
            className="inline-block px-6 py-2 text-sm font-medium text-white bg-renault-dark rounded-md hover:bg-renault-gray transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </Card>
    </div>
  );
};

export default AccessDenied;
