/**
 * IDs de tracking / verificação lidos de variáveis de ambiente Vite.
 * Preencha no .env (ou no painel Lovable → Environment Variables).
 */

function env(key: string): string {
  if (typeof import.meta === "undefined") return "";
  const value = import.meta.env?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export const TRACKING = {
  /** Conteúdo do meta google-site-verification do Search Console */
  googleSiteVerification: env("VITE_GOOGLE_SITE_VERIFICATION"),
  /** GTM container, ex.: GTM-XXXXXXX */
  gtmId: env("VITE_GTM_ID"),
  /** GA4 Measurement ID, ex.: G-XXXXXXXXXX (opcional se usar só GTM) */
  gaId: env("VITE_GA_MEASUREMENT_ID"),
} as const;

export function hasGoogleVerification() {
  return Boolean(TRACKING.googleSiteVerification);
}
