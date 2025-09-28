import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import type { PrendarioResult } from '../../types';

interface PrendarioCardProps {
  resultados: PrendarioResult[];
}

const PrendarioCard: React.FC<PrendarioCardProps> = ({ resultados }) => {
  if (resultados.length === 0) return null;
  const { capitalPrestamo, tna } = resultados[0];

  return (
    <Card title="Alternativa: Préstamo Prendario">
      <div className="space-y-3">
        <p className="text-sm">Financiando un capital de <strong>{formatCurrency(capitalPrestamo)}</strong> con una TNA del <strong>{tna}%</strong>.</p>
        <div className="mt-4 rounded-lg shadow overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plazo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota Mensual Fija</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {resultados.map(res => (
                        <tr key={res.plazo} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800">{res.plazo} meses</td>
                            <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-renault-dark">{formatCurrency(res.cuota)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <p className="text-xs text-gray-500 italic">No incluye gastos de otorgamiento. Sistema de amortización francés.</p>
      </div>
    </Card>
  );
};

export default PrendarioCard;
