
import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Alert from '../common/Alert';
import { formatCurrency } from '../../utils/formatters';
import type { PlanAhorroPresupuesto } from '../../types';

interface PlanAhorroCardProps {
  presupuesto: PlanAhorroPresupuesto;
  title: string;
  isFeatured?: boolean;
}

const PlanAhorroCard: React.FC<PlanAhorroCardProps> = ({ presupuesto, title, isFeatured = false }) => {
  const { plan, cuotasCubiertas, cuotasRestantes, cuotaEstimada, capitalInsuficiente, detalle } = presupuesto;

  return (
    <Card title={title} isFeatured={isFeatured}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-bold text-renault-dark">{plan.modelo}</h4>
          {plan.cuotasFijas && plan.cuotasFijas > 0 ? (
            <Badge>{plan.cuotasFijas} Cuotas Fijas</Badge>
          ) : <Badge color="gray">Sin Cuotas Fijas</Badge>
          }
        </div>
        
        {capitalInsuficiente && <Alert message={detalle} type="warning" />}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-semibold text-gray-600">Cuotas Cubiertas con tu Capital</p>
            <p className="text-2xl font-bold text-green-600">{cuotasCubiertas}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-semibold text-gray-600">Cuotas Restantes a Pagar</p>
            <p className="text-2xl font-bold text-renault-dark">{cuotasRestantes}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md col-span-2">
            <p className="font-semibold text-gray-600">Cuota Mensual Estimada</p>
            <p className="text-2xl font-bold text-renault-dark">{formatCurrency(cuotaEstimada)}</p>
          </div>
        </div>
        
        {plan.observaciones && <p className="text-xs text-gray-500 italic mt-2"><strong>Observaciones:</strong> {plan.observaciones}</p>}
      </div>
    </Card>
  );
};

export default PlanAhorroCard;
