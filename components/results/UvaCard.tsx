import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import type { UvaResult } from '../../types';

interface UvaCardProps {
  resultado: UvaResult;
}

const UvaCard: React.FC<UvaCardProps> = ({ resultado }) => {
  const { capitalPrestamo, escenarios, plazo } = resultado;

  return (
    <Card title="Alternativa: Crédito UVA">
      <div className="space-y-3">
        <p className="text-sm">Financiando un capital de <strong>{formatCurrency(capitalPrestamo)}</strong> en un plazo de <strong>{plazo} meses</strong>.</p>
        <div className="mt-4 rounded-lg shadow overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escenario</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota Inicial Estimada</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {escenarios.map(esc => (
                        <tr key={esc.tipo} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">{esc.tipo}</td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-renault-dark">{formatCurrency(esc.cuotaInicial)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <p className="text-xs text-gray-500 italic">La cuota mensual varía según el valor de la UVA. Valores meramente informativos.</p>
      </div>
    </Card>
  );
};

export default UvaCard;