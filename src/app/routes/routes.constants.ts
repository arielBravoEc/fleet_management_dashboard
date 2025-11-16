/**
 * Constantes de rutas de la aplicación
 * Centraliza todas las rutas para facilitar el mantenimiento
 */
export const ROUTES = {
  // Rutas públicas
  LOGIN: "/login",

  // Rutas protegidas
  HOME: "/",
  ANALYTICS: "/analytics",
  CONFIGURACION: "/configuracion",
} as const;

/**
 * Tipo helper para obtener los valores de las rutas
 */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
