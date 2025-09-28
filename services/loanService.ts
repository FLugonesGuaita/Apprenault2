/**
 * Calcula la cuota de un préstamo usando el sistema francés.
 * @param {number} capital Monto del préstamo.
 * @param {number} tna Tasa Nominal Anual (ej. 58 para 58%).
 * @param {number} plazo en meses.
 * @returns {number} El valor de la cuota mensual.
 */
function calcularCuotaFrances(capital, tna, plazo) {
  if (plazo <= 0 || capital <= 0) return 0;
  const i = tna / 100 / 12; // Tasa efectiva mensual
  if (i === 0) return capital / plazo;
  const cuota = (capital * i) / (1 - Math.pow(1 + i, -plazo));
  return cuota;
}

/**
 * Genera alternativas de préstamo prendario.
 * @param {number} capitalAfinanciar
 * @param {object} params
 * @returns {Array<object>}
 */
export function simularPrendario(
  capitalAfinanciar,
  params
) {
  return params.plazosPermitidos.map(plazo => ({
    plazo,
    tna: params.tna,
    capitalPrestamo: capitalAfinanciar,
    cuota: calcularCuotaFrances(capitalAfinanciar, params.tna, plazo),
  }));
}

/**
 * Genera escenarios para un crédito UVA.
 * @param {number} capitalAfinanciar
 * @param {object} params
 * @returns {object}
 */
export function simularUVA(
  capitalAfinanciar,
  params
) {
  const { coefUVAHoy, proyeccionInflacionMensual, spreadBanco, plazos } = params;
  const plazoSimulacion = plazos[0] || 60; // Usar el primer plazo disponible para la simulación

  const calcularCuotaInicial = (capital, n, uva, spread) => {
    // Simplificación de la cuota UVA. En la realidad es más complejo.
    // Esto es (Capital en UVAs / Plazo) * Valor UVA Hoy
    const capitalEnUva = capital / uva;
    const cuotaEnUva = capitalEnUva / n;
    return cuotaEnUva * uva * (1 + spread);
  };

  const generarProyeccion = (cuotaInicial, inflacionMensual) => {
      let proyeccion = [{mes: 1, cuota: cuotaInicial}];
      let ultimaCuota = cuotaInicial;
      for (let i = 2; i <= 12; i++) { // Proyectar por 12 meses
          ultimaCuota *= (1 + inflacionMensual);
          proyeccion.push({ mes: i, cuota: ultimaCuota });
      }
      return proyeccion;
  };

  const escenarios = (Object.keys(proyeccionInflacionMensual)).map(key => {
    const spreadParaEscenario = spreadBanco[key];
    const cuotaInicial = calcularCuotaInicial(capitalAfinanciar, plazoSimulacion, coefUVAHoy, spreadParaEscenario);
    return {
      tipo: key.charAt(0).toUpperCase() + key.slice(1),
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
