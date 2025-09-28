
import type { Plan, FinancialParams } from './types';

export const INITIAL_PLANS: Plan[] = [
  {
    id: "plan-kwid-1",
    marca: "Renault",
    modelo: "Kwid Iconic Bitono 1.0",
    codigo: "BB1K 400",
    precioLista: 22160000,
    cuotaPura: 184667,
    cuota1: 247950,
    cuotaComercial: 261000, // Valor de "Cuota 2 a 12" de la imagen
    cuotaExtra: 0,
    cuotasTotales: 120,
    cuotasFijas: 12,
    integracionMin: 850000,
    gastosEntrega: 720341,
    gastosAdm: 22345,
    activo: true,
    imageUrl: undefined,
  },
  {
    id: "plan-kardian-1",
    marca: "Renault",
    modelo: "Kardian Evolution MT MY25",
    codigo: "HJF1 110",
    precioLista: 31570000,
    cuotaPura: 263083,
    cuota1: 383000,
    cuotaComercial: 310000, // Valor de "Cuota 2 a 6" de la imagen
    cuotaExtra: 0,
    cuotasTotales: 120,
    cuotasFijas: 6,
    integracionMin: 1170000,
    gastosEntrega: 889198,
    gastosAdm: 31833,
    activo: true,
    imageUrl: undefined,
  }
];

export const DEFAULT_FINANCIAL_PARAMS: FinancialParams = {
  margenConcesionario: 5,
  prendario: {
    tna: 58.0,
    plazosPermitidos: [12, 24, 36, 48, 60],
    gastosAdicionales: 5, // % sobre el préstamo
  },
  uva: {
    coefUVAHoy: 1050.5,
    proyeccionInflacionMensual: {
      base: 0.05, // 5%
      optimista: 0.03, // 3%
      pesimista: 0.08, // 8%
    },
    spreadBanco: {
      base: 0.07, // 7%
      optimista: 0.05, // 5%
      pesimista: 0.09, // 9%
    },
    plazos: [36, 48, 60],
  },
  recomendador: {
    tolerancia: 0.10, // 10%
    estrategia: 'MEJOR_OPCION',
  },
  cargables: {
    gastosAdm: true,
    gastosEntrega: false,
  },
};