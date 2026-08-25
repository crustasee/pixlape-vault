/**
 * Payment & Donation gateways integration helpers (Trakteer, Saweria, Midtrans)
 */

export interface PaymentGateways {
  trakteerUrl: string;
  saweriaUrl: string;
}

export const defaultPaymentGateways: PaymentGateways = {
  trakteerUrl: process.env.NEXT_PUBLIC_TRAKTEER_URL || "https://trakteer.id",
  saweriaUrl: process.env.NEXT_PUBLIC_SAWERIA_URL || "https://saweria.co",
};

export function getTrakteerLink(usernameOrPath?: string): string {
  if (!usernameOrPath) return defaultPaymentGateways.trakteerUrl;
  if (usernameOrPath.startsWith("http")) return usernameOrPath;
  return `https://trakteer.id/${usernameOrPath.replace(/^@/, "")}`;
}

export function getSaweriaLink(usernameOrPath?: string): string {
  if (!usernameOrPath) return defaultPaymentGateways.saweriaUrl;
  if (usernameOrPath.startsWith("http")) return usernameOrPath;
  return `https://saweria.co/${usernameOrPath.replace(/^@/, "")}`;
}