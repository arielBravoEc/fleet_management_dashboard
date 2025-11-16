/**
 * Utilidad para combinar clases de Tailwind CSS
 * Útil para aplicar clases condicionales
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
