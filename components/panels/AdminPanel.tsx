
import React, { useState, useReducer, ChangeEvent, Fragment } from 'react';
import Card from '../common/Card.tsx';
import Button from '../common/Button.tsx';
import Input from '../common/Input.tsx';
import { usePlans } from '../../contexts/PlanContext.tsx';
import { useFinancialParams } from '../../contexts/FinancialContext.tsx';
import { useBranding } from '../../contexts/BrandingContext.tsx';
import type { FinancialParams, Plan } from '../../types.ts';
import { formatCurrency } from '../../utils/formatters.ts';
import Badge from '../common/Badge.tsx';

const initialPlanState: Omit<Plan, 'id' | 'activo' | 'marca'> = {
  modelo: '',
  codigo: '',
  precioLista: 0,
  cuotaPura: 0,
  cuota1: 0,
  cuotaComercial: 0,
  cuotaExtra: 0,
  cuotasTotales: 120,
  cuotasFijas: 0,
  integracionMin: 0,
  gastosEntrega: 0,
  gastosAdm: 0,
  observaciones: '',
  imageUrl: '',
};

type PlanAction = { type: 'UPDATE_FIELD'; field: keyof typeof initialPlanState; value: any } | { type: 'RESET' };

function planReducer(state: Omit<Plan, 'id' | 'activo' | 'marca'>, action: PlanAction) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialPlanState;
    default:
      return state;
  }
}

const AdminPanel: React.FC = () => {
  const { plans, addPlan, updatePlan, togglePlanStatus } = usePlans();
  const { params, setParams } = useFinancialParams();
  const { logo, setLogo } = useBranding();
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [planState, dispatch] = useReducer(planReducer, initialPlanState);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, ...path: (string | number)[]) => {
    // FIX: Property 'checked' does not exist on type 'HTMLSelectElement'.
    // Destructuring 'checked' from e.target is unsafe. This implementation
    // safely determines the value based on the element's type.
    const { value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) || 0 : value;

    setParams(prev => {
        let newParams = JSON.parse(JSON.stringify(prev));
        // FIX: Add 'any' type to 'current' to allow dynamic property access while traversing the object path.
        let current: any = newParams;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
        }
        current[path[path.length - 1]] = val;
        return newParams;
    });
  };

  const handlePlanFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    dispatch({
      type: 'UPDATE_FIELD',
      field: name as keyof typeof initialPlanState,
      value: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handlePlanImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      dispatch({ type: 'UPDATE_FIELD', field: 'imageUrl', value: '' });
      return;
    }

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Por favor, suba un archivo PNG o JPG.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({
        type: 'UPDATE_FIELD',
        field: 'imageUrl',
        value: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSavePlan = () => {
    const planData = { ...planState, marca: 'Renault' as const };
    if (editingPlanId) {
      updatePlan({ ...planData, id: editingPlanId, activo: plans.find(p => p.id === editingPlanId)?.activo ?? true });
    } else {
      addPlan(planData);
    }
    setEditingPlanId(null);
    dispatch({ type: 'RESET' });
  };
  
  const handleEditPlan = (plan: Plan) => {
    setEditingPlanId(plan.id);
    Object.keys(initialPlanState).forEach(keyStr => {
      const key = keyStr as keyof typeof initialPlanState;
      dispatch({ type: 'UPDATE_FIELD', field: key, value: plan[key] || initialPlanState[key] });
    });
  };

  const handleCancelEdit = () => {
    setEditingPlanId(null);
    dispatch({ type: 'RESET' });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Por favor, suba un archivo PNG o JPG.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-renault-dark">Panel de Administración</h1>

      {/* Personalización de Marca */}
      <Card title="Personalización de Marca">
        <div className="space-y-4">
          <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700">
            Logo de la Empresa (PNG o JPG)
          </label>
          {logo && (
            <div className="my-2">
              <p className="text-xs text-gray-500 mb-2">Vista previa actual:</p>
              <img src={logo} alt="Logo actual" className="h-16 w-auto object-contain border p-2 rounded-md bg-white"/>
            </div>
          )}
          <div className="flex items-center gap-4">
            <input
              id="logo-upload"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleLogoUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-renault-yellow file:text-renault-dark hover:file:bg-yellow-400 cursor-pointer"
            />
            {logo && (
              <Button variant="danger" onClick={() => setLogo(null)}>
                Quitar Logo
              </Button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">Este logo aparecerá en el PDF del presupuesto.</p>
        </div>
      </Card>
      
      {/* Gestión de Planes */}
      <Card title={editingPlanId ? "Editando Plan" : "Agregar Nuevo Plan"}>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={(e) => { e.preventDefault(); handleSavePlan(); }}>
          {Object.keys(initialPlanState).filter(k => k !== 'imageUrl').map(key => (
            <Input
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              id={key}
              name={key}
              type={typeof initialPlanState[key as keyof typeof initialPlanState] === 'number' ? 'number' : 'text'}
              value={planState[key as keyof typeof initialPlanState] as any}
              onChange={handlePlanFieldChange}
            />
          ))}
          <div className="col-span-full space-y-2">
            <label htmlFor="plan-image-upload" className="block text-sm font-medium text-gray-700">
                Foto del Vehículo (PNG o JPG)
            </label>
            {planState.imageUrl && (
                <div className="my-2 flex items-end gap-4">
                    <img src={planState.imageUrl} alt="Vista previa" className="h-24 w-auto object-contain border p-2 rounded-md bg-white"/>
                    <Button type="button" variant="secondary" onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'imageUrl', value: '' })}>
                        Quitar Imagen
                    </Button>
                </div>
            )}
            <input
                id="plan-image-upload"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handlePlanImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-renault-yellow file:text-renault-dark hover:file:bg-yellow-400 cursor-pointer"
            />
          </div>
          <div className="col-span-full flex justify-end gap-2 mt-4">
             {editingPlanId && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
            <Button type="submit">{editingPlanId ? "Guardar Cambios" : "Agregar Plan"}</Button>
          </div>
        </form>
      </Card>
      
      <Card title="Planes Existentes">
        <div className="rounded-lg shadow overflow-x-auto border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Lista</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota Pura</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map(plan => (
                <Fragment key={plan.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {plan.imageUrl ? (
                        <img src={plan.imageUrl} alt={plan.modelo} className="h-10 w-16 object-cover rounded" />
                      ) : (
                        <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">Sin foto</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{plan.modelo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(plan.precioLista)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(plan.cuotaPura)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${plan.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {plan.activo ? 'Activo' : 'Archivado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleEditPlan(plan)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                      <button onClick={() => togglePlanStatus(plan.id)} className="text-yellow-600 hover:text-yellow-900">
                        {plan.activo ? 'Archivar' : 'Activar'}
                      </button>
                      <button onClick={() => setExpandedPlanId(prevId => prevId === plan.id ? null : plan.id)} className="text-blue-600 hover:text-blue-900">
                        Detalles
                      </button>
                    </td>
                  </tr>
                  {expandedPlanId === plan.id && (
                    <tr className="bg-gray-50 border-b-2 border-gray-300">
                      <td colSpan={6} className="p-4">
                        <h4 className="font-bold text-md mb-2 text-renault-dark">Detalle de Cuotas del Plan</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Cuota 1</p>
                            <p className="text-lg font-bold text-renault-dark">{formatCurrency(plan.cuota1)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Cuota 2 a {plan.cuotasFijas}</p>
                            <p className="text-lg font-bold text-renault-dark">{formatCurrency(plan.cuotaComercial)}</p>
                            {plan.cuotasFijas && plan.cuotasFijas > 0 && <Badge color="yellow">{plan.cuotasFijas} Cuotas Fijas</Badge>}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500">Cuota Pura (ref.)</p>
                            <p className="text-lg font-bold text-renault-dark">{formatCurrency(plan.cuotaPura)}</p>
                          </div>
                           <div>
                            <p className="text-xs font-semibold text-gray-500">Gastos Adm. (ref.)</p>
                            <p className="text-lg font-bold text-renault-dark">{formatCurrency(plan.gastosAdm)}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Parámetros Financieros */}
      <Card title="Parámetros Financieros Globales">
        <div className="space-y-8">
          {/* General */}
          <div>
            <h3 className="text-lg font-semibold mb-2 border-b pb-2">Configuración General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <Input 
                  id="margen-concesionario"
                  label="Margen Precio Créditos (%)"
                  type="number"
                  value={params.margenConcesionario}
                  onChange={e => handleParamChange(e, 'margenConcesionario')}
                />
                <p className="text-xs text-gray-500 mt-1">Porcentaje agregado al precio de lista para calcular el capital a financiar en créditos.</p>
              </div>
              <div>
                <label htmlFor="estrategia-recomendacion" className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Destacado a Recomendar
                </label>
                <select
                  id="estrategia-recomendacion"
                  name="estrategia"
                  value={params.recomendador.estrategia}
                  onChange={e => handleParamChange(e, 'recomendador', 'estrategia')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-renault-yellow focus:border-renault-yellow sm:text-sm rounded-md"
                >
                  <option value="MEJOR_OPCION">Mejor Opción (Automática)</option>
                  <option value="PLAN_SOLICITADO">Opción Genérica (Plan Solicitado)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prendario */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Préstamo Prendario</h3>
                <div className="space-y-4">
                    <Input id="prendario-tna" label="TNA (%)" type="number" value={params.prendario.tna} onChange={e => handleParamChange(e, 'prendario', 'tna')} />
                    <Input id="prendario-gastosAdicionales" label="Gastos Adicionales (%)" type="number" value={params.prendario.gastosAdicionales} onChange={e => handleParamChange(e, 'prendario', 'gastosAdicionales')} />
                </div>
            </div>
            {/* UVA */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Crédito UVA</h3>
              <div className="space-y-4">
                  <Input id="uva-coefUVAHoy" label="Valor UVA Hoy" type="number" value={params.uva.coefUVAHoy} onChange={e => handleParamChange(e, 'uva', 'coefUVAHoy')} />
                  
                  <h4 className="text-md font-medium text-gray-600 pt-2 border-t mt-4">Spread del Banco (%)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input id="uva-spreadBanco-optimista" label="Optimista" type="number" value={params.uva.spreadBanco.optimista * 100} onChange={e => setParams(p => ({...p, uva: {...p.uva, spreadBanco: {...p.uva.spreadBanco, optimista: parseFloat(e.target.value)/100 || 0}}}))} />
                      <Input id="uva-spreadBanco-base" label="Base" type="number" value={params.uva.spreadBanco.base * 100} onChange={e => setParams(p => ({...p, uva: {...p.uva, spreadBanco: {...p.uva.spreadBanco, base: parseFloat(e.target.value)/100 || 0}}}))} />
                      <Input id="uva-spreadBanco-pesimista" label="Pesimista" type="number" value={params.uva.spreadBanco.pesimista * 100} onChange={e => setParams(p => ({...p, uva: {...p.uva, spreadBanco: {...p.uva.spreadBanco, pesimista: parseFloat(e.target.value)/100 || 0}}}))} />
                  </div>

                  <h4 className="text-md font-medium text-gray-600 pt-2 border-t mt-4">Proyección Inflación Mensual (%)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input id="uva-proyeccionInflacionOptimista" label="Optimista" type="number" value={params.uva.proyeccionInflacionMensual.optimista * 100} onChange={e => setParams(p => ({...p, uva: {...p.uva, proyeccionInflacionMensual: {...p.uva.proyeccionInflacionMensual, optimista: parseFloat(e.target.value)/100 || 0}}}))} />
                      <Input id="uva-proyeccionInflacionBase" label="Base" type="number" value={params.uva.proyeccionInflacionMensual.base * 100} onChange={e => setParams(p => ({...p, uva: {...p.uva, proyeccionInflacionMensual: {...p.uva.proyeccionInflacionMensual, base: parseFloat(e.target.value)/100 || 0}}}))} />
                      <Input id="uva-proyeccionInflacionPesimista" label="Pesimista" type="number" value={params.uva.proyeccionInflacionMensual.pesimista * 100} onChange={e => setParams(p => ({...p, uva: {...p.uva, proyeccionInflacionMensual: {...p.uva.proyeccionInflacionMensual, pesimista: parseFloat(e.target.value)/100 || 0}}}))} />
                  </div>
              </div>
            </div>
            {/* Cargables */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Cargos en Cuota</h3>
                 <div className="space-y-2">
                    <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-renault-yellow focus:ring-renault-yellow border-gray-300 rounded" checked={params.cargables.gastosAdm} onChange={e => handleParamChange(e, 'cargables', 'gastosAdm')} />
                        <span className="ml-2 text-gray-700">Incluir Gastos Administrativos</span>
                    </label>
                 </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;