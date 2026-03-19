/**
 * Utility to get the correct API URL based on the environment.
 * In development (localhost), it uses the Express server's /api prefix.
 * In production (Netlify), it uses the Netlify Functions' /.netlify/functions prefix.
 */
export const getApiUrl = (endpoint: string): string => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Clean endpoint by removing leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (isLocal) {
    // If it's a broadcast/notify endpoint, Express expects /api/endpoint
    return `/api/${cleanEndpoint}`;
  }
  
  // Netlify Functions are at /.netlify/functions/endpoint
  return `/.netlify/functions/${cleanEndpoint}`;
};
