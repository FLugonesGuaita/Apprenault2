
import type { FinancialParams, PrendarioResult, UvaResult, UvaScenario } from '../types.ts';

/**
 * Calcula la cuota de un préstamo usando el sistema francés.
 * @param capital Monto del préstamo.
 * @param tna Tasa Nominal Anual (ej. 58 para 58%).
 * @param plazo en meses.
 * @returns El valor de la cuota mensual.
 */
function calcularCuotaFrances(capital: number, tna: number, plazo: number): number {
  if (plazo <= 0 || capital <= 0) return 0;
  const i = tna / 100 / 12; // Tasa efectiva mensual
  if (i === 0) return capital / plazo;
  const cuota = (capital * i) / (1 - Math.pow(1 + i, -plazo));
  return cuota;
}

/**
 * Genera alternativas de préstamo prendario.
 */
export function simularPrendario(
  capitalAfinanciar: number,
  params: FinancialParams['prendario']
): PrendarioResult[] {
  return params.plazosPermitidos.map(plazo => ({
    plazo,
    tna: params.tna,
    capitalPrestamo: capitalAfinanciar,
    cuota: calcularCuotaFrances(capitalAfinanciar, params.tna, plazo),
  }));
}

/**
 * Genera escenarios para un crédito UVA.
 */
export function simularUVA(
  capitalAfinanciar: number,
  params: FinancialParams['uva']
): UvaResult {
  const { coefUVAHoy, proyeccionInflacionMensual, spreadBanco, plazos } = params;
  const plazoSimulacion = plazos[0] || 60; // Usar el primer plazo disponible para la simulación

  const calcularCuotaInicial = (capital: number, n: number, uva: number, spread: number): number => {
    // Simplificación de la cuota UVA. En la realidad es más complejo.
    // Esto es (Capital en UVAs / Plazo) * Valor UVA Hoy
    const capitalEnUva = capital / uva;
    const cuotaEnUva = capitalEnUva / n;
    return cuotaEnUva * uva * (1 + spread);
  };

  const generarProyeccion = (cuotaInicial: number, inflacionMensual: number): {mes: number, cuota: number}[] => {
      let proyeccion: {mes: number, cuota: number}[] = [{mes: 1, cuota: cuotaInicial}];
      let ultimaCuota = cuotaInicial;
      for (let i = 2; i <= 12; i++) { // Proyectar por 12 meses
          ultimaCuota *= (1 + inflacionMensual);
          proyeccion.push({ mes: i, cuota: ultimaCuota });
      }
      return proyeccion;
  };

  const escenarios: UvaScenario[] = (Object.keys(proyeccionInflacionMensual) as Array<keyof typeof proyeccionInflacionMensual>).map(key => {
    const spreadParaEscenario = spreadBanco[key];
    const cuotaInicial = calcularCuotaInicial(capitalAfinanciar, plazoSimulacion, coefUVAHoy, spreadParaEscenario);
    return {
      tipo: key.charAt(0).toUpperCase() + key.slice(1) as UvaScenario['tipo'],
      cuotaInicial: cuotaInicial,
      proyeccion: generarProyeccion(cuotaInicial, proyeccionInflacionMensual[key])
    };
  });

  return {
    capitalPrestamo: capitalAfinanciar,
    plazo: plazoSimulacion,
    escenarios,
  };
}