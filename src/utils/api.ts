/**
 * Utility to get the correct API URL based on the environment.
 * Now exclusively uses Netlify Functions for both local and production.
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `/.netlify/functions/${cleanEndpoint}`;
};
