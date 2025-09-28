'use client';
import React, { useState, useMemo, useEffect } from 'react';
import type { Plan, ClientInput, RecommendationResult, SellerInfo, ClientDetails } from '../../types.ts';
import { usePlans } from '../../contexts/PlanContext.tsx';
import { useFinancialParams } from '../../contexts/FinancialContext.tsx';
import { recommend } from '../../services/recommendationService.ts';
import Card from '../common/Card.tsx';
import Input from '../common/Input.tsx';
import Select from '../common/Select.tsx';
import Button from '../common/Button.tsx';
import ResultsDisplay from '../results/ResultsDisplay.tsx';
import { formatCurrency } from '../../utils/formatters.ts';
import Alert from '../common/Alert.tsx';

const defaultSellerInfo: SellerInfo = {
  name: 'Renault Lepic - Ventas Online',
  phone: '0810-888-5374',
  email: 'ventas@lepic.com.ar',
};

interface ClientePanelProps {
  sellerInfo?: SellerInfo;
  clientDetails?: ClientDetails;
}

const ClientePanel: React.FC<ClientePanelProps> = ({ sellerInfo = defaultSellerInfo, clientDetails }) => {
  const { plans } = usePlans();
  const { params } = useFinancialParams();
  const activePlans = useMemo(() => plans.filter(p => p.activo), [plans]);

  const [clientInput, setClientInput] = useState<ClientInput>({
    autoSolicitadoId: activePlans[0]?.id || '',
    capitalCliente: 0,
    cuotaObjetivo: 0,
  });

  const [results, setResults] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    // This effect runs only on the client after mount
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('autoSolicitadoId')) {
      const autoId = searchParams.get('autoSolicitadoId');
      const capital = searchParams.get('capitalCliente');
      const objetivo = searchParams.get('cuotaObjetivo');

      if (autoId && capital && objetivo && activePlans.some(p => p.id === autoId)) {
        const newClientInput: ClientInput = {
          autoSolicitadoId: autoId,
          capitalCliente: parseFloat(capital) || 0,
          cuotaObjetivo: parseFloat(objetivo) || 0,
        };

        setClientInput(newClientInput);
        const recommendation = recommend(newClientInput, activePlans, params);
        setResults(recommendation);

        // Clean up URL to avoid re-triggering on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [activePlans, params]); // Depend on activePlans to ensure they are loaded

  const selectedPlan = useMemo(() => {
    return plans.find(p => p.id === clientInput.autoSolicitadoId);
  }, [clientInput.autoSolicitadoId, plans]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setClientInput(prev => ({ ...prev, [id]: id === 'autoSolicitadoId' ? value : parseFloat(value) || 0 }));
  };

  const handleCalculate = () => {
    if (!selectedPlan) {
      setError('Por favor, seleccione un vehículo.');
      return;
    }
    if (clientInput.capitalCliente < 0 || clientInput.cuotaObjetivo <= 0) {
      setError('Por favor, ingrese un capital y cuota objetivo válidos.');
      return;
    }
    setError('');
    const recommendation = recommend(clientInput, activePlans, params);
    setResults(recommendation);
  };

  const isIntegrationMinMet = selectedPlan && clientInput.capitalCliente < selectedPlan.integracionMin;

  return (
    <div className="container mx-auto space-y-8">
      <Card title="Simulador de Presupuesto para tu Renault 0km">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Columna 1: Selección de Plan */}
          <div className="space-y-4">
            <Select
              label="Auto que querés"
              id="autoSolicitadoId"
              value={clientInput.autoSolicitadoId}
              onChange={handleInputChange}
            >
              <option value="">-- Seleccionar modelo --</option>
              {activePlans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.modelo}</option>
              ))}
            </Select>
             {selectedPlan && (
              <div className="text-sm p-3 bg-gray-50 rounded-md border">
                  {selectedPlan.imageUrl && (
                    <img src={selectedPlan.imageUrl} alt={selectedPlan.modelo} className="w-full h-auto object-cover rounded-md mb-3" />
                  )}
                  <h4 className="font-bold mb-2">Detalles de la Financiación Seleccionada</h4>
                  <p><strong>Precio Lista:</strong> {formatCurrency(selectedPlan.precioLista)}</p>
                  <p><strong>Cuotas Totales:</strong> {selectedPlan.cuotasTotales}</p>
                  <p><strong>Cuota Pura:</strong> {formatCurrency(selectedPlan.cuotaPura)}</p>
                  <p><strong>Integración Mínima:</strong> {formatCurrency(selectedPlan.integracionMin)}</p>
              </div>
            )}
          </div>

          {/* Columna 2: Inputs del Cliente */}
          <div className="space-y-4">
            <Input
              label="Capital disponible para integrar"
              id="capitalCliente"
              type="number"
              value={clientInput.capitalCliente || ''}
              onChange={handleInputChange}
              min="0"
              icon={<span className="text-gray-400">$</span>}
            />
            <Input
              label="¿Cuánto podés pagar por mes?"
              id="cuotaObjetivo"
              type="number"
              value={clientInput.cuotaObjetivo || ''}
              onChange={handleInputChange}
              min="0"
              icon={<span className="text-gray-400">$</span>}
            />
          </div>

          {/* Columna 3: Acciones */}
          <div className="md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              {error && <Alert message={error} type="warning" />}
              {isIntegrationMinMet && !error && (
                <Alert
                  message={`Tu capital es menor a la integración mínima de ${formatCurrency(selectedPlan.integracionMin)}. Te mostraremos alternativas.`}
                  type="info"
                />
              )}
            </div>
            <Button onClick={handleCalculate} className="w-full mt-4">
              Calcular Presupuesto
            </Button>
          </div>
        </div>
      </Card>

      {results && <ResultsDisplay results={results} clientInput={clientInput} sellerInfo={sellerInfo} clientDetails={clientDetails} />}
    </div>
  );
};

export default ClientePanel;