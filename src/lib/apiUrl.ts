// Centralized API URL getter:
// - Server-side (server components, API routes): reads API_URL at runtime — safe, never baked into bundle
// - Client-side (browser): returns /api/proxy — Next.js proxy route forwards to API_URL at runtime
// This means different deployments only need API_URL set per environment; no build-time baking.
export const getApiUrl = (): string => {
  const isServer = typeof window === "undefined";
  if (isServer) {
    return (
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://gocritserver-production.up.railway.app"
    );
  }
  // Browser: go through the Next.js proxy route which reads API_URL server-side at runtime
  return "/api/proxy";
};
