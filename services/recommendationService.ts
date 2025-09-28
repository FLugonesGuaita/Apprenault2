
import type { Plan, ClientInput, FinancialParams, RecommendationResult, PlanAhorroPresupuesto } from '../types.ts';
import { aplicarCapital, calcularCuotaEstimada } from './calculationService.ts';
import { simularPrendario, simularUVA } from './loanService.ts';

/**
 * Genera un presupuesto detallado para una financiación directa de fábrica.
 */
function generarPresupuestoAhorro(plan: Plan, capitalCliente: number, params: FinancialParams): PlanAhorroPresupuesto {
  const { cuotasCubiertas, cuotasRestantes } = aplicarCapital(plan, capitalCliente);
  const cuotaEstimada = calcularCuotaEstimada(plan);
  const capitalInsuficiente = capitalCliente < plan.integracionMin;
  const detalle = capitalInsuficiente 
    ? `El capital ingresado no cumple con la integración mínima de ${plan.integracionMin}.`
    : `Tu capital cubre ${cuotasCubiertas} cuotas del plan.`;

  return {
    plan,
    cuotasCubiertas,
    cuotasRestantes,
    cuotaEstimada,
    capitalInsuficiente,
    detalle
  };
}

/**
 * Recomienda el mejor plan y alternativas de financiamiento basado en la entrada del cliente.
 */
export function recommend(
  input: ClientInput,
  planesDisponibles: Plan[],
  params: FinancialParams
): RecommendationResult {
  const { autoSolicitadoId, capitalCliente, cuotaObjetivo } = input;
  const { margenConcesionario, recomendador } = params;
  
  const planSolicitadoSeleccionado = planesDisponibles.find(p => p.id === autoSolicitadoId);
  
  if (!planSolicitadoSeleccionado) {
    // Salvaguarda por si el plan seleccionado no se encuentra.
    return {
      alternativasPrendario: [],
      alternativasUVA: simularUVA(0, params.uva)
    };
  }

  // 1. Generar presupuesto para el plan que el cliente seleccionó explícitamente.
  const presupuestoSolicitado = generarPresupuestoAhorro(planSolicitadoSeleccionado, capitalCliente, params);

  // 2. Buscar el mejor plan basado en la estrategia definida por el administrador.
  let mejorPlan: PlanAhorroPresupuesto | undefined;

  if (recomendador.estrategia === 'PLAN_SOLICITADO') {
    // Estrategia "Genérica": El mejor plan es el que el cliente solicitó.
    mejorPlan = presupuestoSolicitado;
  } else {
    // Estrategia "Mejor Opción": Buscar el plan viable con la cuota más cercana al objetivo.
    const presupuestosViables = planesDisponibles
      .map(p => generarPresupuestoAhorro(p, capitalCliente, params))
      .filter(p => !p.capitalInsuficiente);

    if (presupuestosViables.length > 0) {
      // Ordenar por la diferencia absoluta entre la cuota estimada y la objetivo.
      presupuestosViables.sort((a, b) => 
        Math.abs(a.cuotaEstimada - cuotaObjetivo) - Math.abs(b.cuotaEstimada - cuotaObjetivo)
      );
      mejorPlan = presupuestosViables[0];
    } else {
      // Si ningún plan es viable, se muestra el solicitado con su advertencia.
      mejorPlan = presupuestoSolicitado;
    }
  }
  
  // 3. Generar alternativas de préstamo basadas en el PRECIO DE VENTA DEL CONCESIONARIO.
  // Este precio se calcula usando el margen configurable.
  const precioVentaConcesionario = planSolicitadoSeleccionado.precioLista * (1 + (margenConcesionario / 100));
  const capitalAfinanciar = Math.max(0, precioVentaConcesionario - capitalCliente);
  
  const alternativasPrendario = simularPrendario(capitalAfinanciar, params.prendario);
  const alternativasUVA = simularUVA(capitalAfinanciar, params.uva);

  return {
    mejorPlan,
    planSolicitado: presupuestoSolicitado,
    alternativasPrendario,
    alternativasUVA,
  };
}