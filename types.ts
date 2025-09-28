
export interface Plan {
  id: string;
  marca: "Renault";
  modelo: string;
  codigo?: string;
  precioLista: number;
  cuotaPura: number;
  cuota1: number;
  cuotaComercial: number; // Valor de la cuota de referencia para estimaciones (ej. cuota 2 a 12)
  cuotaExtra?: number;
  cuotasTotales: number;
  cuotasFijas?: number;
  integracionMin: number;
  gastosEntrega?: number;
  gastosAdm?: number;
  observaciones?: string;
  activo: boolean;
  imageUrl?: string;
}

export interface ClientInput {
  autoSolicitadoId: string;
  capitalCliente: number;
  cuotaObjetivo: number;
}

export interface SellerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface ClientDetails {
  name: string;
  phone?: string;
  email?: string;
}

export interface CapitalApplicationResult {
  cubreCuotaExtra: boolean;
  capitalRemanente: number;
  cuotasCubiertas: number;
  cuotasRestantes: number;
  saldoPendienteInicial: number;
}

export interface PlanAhorroPresupuesto {
  plan: Plan;
  cuotasCubiertas: number;
  cuotasRestantes: number;
  cuotaEstimada: number;
  capitalInsuficiente: boolean;
  detalle: string;
}

export interface PrendarioResult {
  plazo: number;
  tna: number;
  cuota: number;
  capitalPrestamo: number;
}

export interface UvaScenario {
  tipo: 'Base' | 'Optimista' | 'Pesimista';
  cuotaInicial: number;
  proyeccion: { mes: number, cuota: number }[];
}

export interface UvaResult {
  capitalPrestamo: number;
  plazo: number;
  escenarios: UvaScenario[];
}

// FIX: Define and export the missing 'RecommendationResult' type.
export interface RecommendationResult {
  mejorPlan?: PlanAhorroPresupuesto;
  planSolicitado?: PlanAhorroPresupuesto;
  alternativasPrendario: PrendarioResult[];
  alternativasUVA: UvaResult;
}

export type UserRole = 'CLIENTE' | 'VENDEDOR' | 'ADMIN';

export interface FinancialParams {
  margenConcesionario: number;
  prendario: {
    tna: number;
    plazosPermitidos: number[];
    gastosAdicionales: number;
  };
  uva: {
    coefUVAHoy: number;
    proyeccionInflacionMensual: {
      base: number;
      optimista: number;
      pesimista: number;
    };
    spreadBanco: {
      base: number;
      optimista: number;
      pesimista: number;
    };
    plazos: number[];
  };
  recomendador: {
    tolerancia: number;
    estrategia: 'MEJOR_OPCION' | 'PLAN_SOLICITADO';
  };
  cargables: {
    gastosAdm: boolean;
    gastosEntrega: boolean;
  };
}