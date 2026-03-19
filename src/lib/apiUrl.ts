// Centralized API URL getter with fallback
export const getApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  
  // Always fallback to production backend if not defined
  if (!url) {
    return "https://gocritserver-production.up.railway.app";
  }
  
  return url;
};
