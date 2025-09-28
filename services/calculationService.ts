
import type { Plan, CapitalApplicationResult, FinancialParams } from '../types.ts';

/**
 * Aplica el capital del cliente a una financiación directa de fábrica.
 * @param plan La financiación.
 * @param capital El capital disponible del cliente.
 * @returns Un objeto con el resultado de la aplicación del capital.
 */
export function aplicarCapital(plan: Plan, capital: number): CapitalApplicationResult {
  let capitalRemanente = capital;
  let saldoPendienteInicial = 0;
  const cuotaExtra = plan.cuotaExtra || 0;
  let cubreCuotaExtra = true;
  let cuotasCubiertas = 0;

  // Primero, se intenta cubrir la cuota extra si existe.
  if (cuotaExtra > 0) {
    if (capitalRemanente >= cuotaExtra) {
      capitalRemanente -= cuotaExtra;
    } else {
      saldoPendienteInicial = cuotaExtra - capitalRemanente;
      capitalRemanente = 0;
      cubreCuotaExtra = false;
    }
  }

  // Con el capital restante, se calculan cuántas cuotas puras se pueden cubrir.
  // La fórmula es: floor((capital - cuotaExtra) / cuotaPura)
  if (plan.cuotaPura > 0) {
    cuotasCubiertas = Math.floor(capitalRemanente / plan.cuotaPura);
  }
  
  const capitalUsadoEnCuotasPuras = cuotasCubiertas * plan.cuotaPura;
  const capitalSobranteFinal = capitalRemanente - capitalUsadoEnCuotasPuras;
  
  const cuotasRestantes = Math.max(plan.cuotasTotales - cuotasCubiertas, 0);

  return {
    cubreCuotaExtra,
    capitalRemanente: capitalSobranteFinal,
    cuotasCubiertas,
    cuotasRestantes,
    saldoPendienteInicial,
  };
}

/**
 * Calcula la cuota estimada a pagar por el cliente.
 * @param plan La financiación.
 * @returns El valor de la cuota estimada.
 */
export function calcularCuotaEstimada(plan: Plan): number {
  // Según el requerimiento, la cuota estimada es el valor comercial
  // que corresponde a la "cuota 2 en adelante".
  // Este valor ya debería incluir gastos administrativos, seguros, etc.
  return plan.cuotaComercial;
}