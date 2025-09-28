
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '$ 0';
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
