/**
 * Determina la ruta base de la aplicación.
 * Para GitHub Pages, será el nombre del repositorio (ej. /repo-name).
 * Para desarrollo local o dominios personalizados, será una cadena vacía.
 * @returns {string} La ruta base.
 */
const getBasePath = (): string => {
  // En un entorno de prueba o si no hay window, devuelve una ruta raíz.
  if (typeof window === 'undefined') return '';

  const path = window.location.pathname;
  // Asume la estructura de GitHub Pages: user.github.io/repo-name/...
  if (window.location.hostname.endsWith('github.io')) {
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      return `/${segments[0]}`;
    }
  }
  return '';
};

/**
 * La ruta base calculada para la aplicación.
 */
export const BASE_PATH = getBasePath();

/**
 * Antepone la ruta base a una ruta dada, creando una ruta de URL pública completa.
 * @param {string} path - La ruta relativa de la aplicación (ej. '/vendedor').
 * @returns {string} La ruta completa incluyendo la ruta base (ej. '/repo-name/vendedor').
 */
export const resolvePath = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (BASE_PATH === '') {
    return cleanPath;
  }
  return `${BASE_PATH}${cleanPath}`;
};

/**
 * Extrae la ruta relativa de la aplicación desde una ruta de URL pública completa, eliminando la ruta base.
 * @param {string} fullPath - La ruta completa desde window.location.pathname.
 * @returns {string} La ruta relativa de la aplicación (ej. '/vendedor').
 */
export const getAppPath = (fullPath: string): string => {
  if (BASE_PATH && fullPath.startsWith(BASE_PATH)) {
    const appPath = fullPath.substring(BASE_PATH.length);
    // Devuelve '/' si el resultado es una cadena vacía (es la raíz de la app)
    return appPath || '/';
  }
  return fullPath;
};
