/**
 * Absolute API host for server-side fetches.
 * In the browser, use the same-origin `/backend` rewrite (see next.config.ts)
 * so Vercel → Railway does not depend on CORS.
 */
export function apiBase(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  }
  return "/backend";
}

/** Absolute URL for downloads / anchors that leave the app (no CORS). */
export function absoluteApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
}
