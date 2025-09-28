import React, { useState } from 'react';
import ClientePanel from './ClientePanel.jsx';
import Card from '../common/Card.jsx';
import Input from '../common/Input.jsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';

const VendedorPanel = () => {
  const [sellerInfo, setSellerInfo] = useLocalStorage('renault-seller-info', {
    name: 'Juan Pérez',
    phone: '+54 9 11 1234-5678',
    email: 'juan.perez@renaultlepic.com',
  });
  
  const [clientDetails, setClientDetails] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleSellerInfoChange = (e) => {
    const { id, value } = e.target;
    setSellerInfo(prev => ({ ...prev, [id]: value }));
  };
  
  const handleClientInfoChange = (e) => {
    const { id, value } = e.target;
    setClientDetails(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-renault-dark">Panel de Vendedor</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Datos del Asesor Comercial">
            <div className="space-y-4">
              <Input
                label="Nombre y Apellido"
                id="name"
                value={sellerInfo.name}
                onChange={handleSellerInfoChange}
              />
              <Input
                label="Teléfono de Contacto"
                id="phone"
                value={sellerInfo.phone}
                onChange={handleSellerInfoChange}
              />
              <Input
                label="Email de Contacto"
                id="email"
                type="email"
                value={sellerInfo.email}
                onChange={handleSellerInfoChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Esta información aparecerá en el PDF del presupuesto.</p>
          </Card>
          
          <Card title="Datos del Cliente">
            <div className="space-y-4">
              <Input
                label="Nombre y Apellido del Cliente"
                id="name"
                value={clientDetails.name}
                onChange={handleClientInfoChange}
              />
              <Input
                label="Teléfono del Cliente (Opcional)"
                id="phone"
                value={clientDetails.phone}
                onChange={handleClientInfoChange}
              />
              <Input
                label="Email del Cliente (Opcional)"
                id="email"
                type="email"
                value={clientDetails.email}
                onChange={handleClientInfoChange}
              />
            </div>
             <p className="text-xs text-gray-500 mt-2">Esta información se incluirá en el PDF para personalizarlo.</p>
          </Card>
      </div>


      <ClientePanel sellerInfo={sellerInfo} clientDetails={clientDetails} />
      
      <Card title="Historial de Presupuestos (Próximamente)">
        <p>Aquí se mostrará un historial de los presupuestos generados, con opciones de búsqueda, filtro y exportación a CSV/PDF.</p>
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">Funcionalidad en desarrollo.</p>
        </div>
      </Card>
    </div>
  );
};

export default VendedorPanel;
