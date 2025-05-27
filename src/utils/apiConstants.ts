// Constants.ts
export const API_CONFIG = {
  SUBDOMAIN: 'alaestore',
  DOMAIN: 'lvh.me',
  PORT: '8000',
  API_VERSION: 'v1'
} as const;

export const getBaseUrl = (): string => {
  return `http://${API_CONFIG.SUBDOMAIN}.${API_CONFIG.DOMAIN}:${API_CONFIG.PORT}/api/${API_CONFIG.API_VERSION}`;
};

export const API_ENDPOINTS = {
  PRODUCTS: '/products/',
  CHECKOUT: '/checkout/',
  WILAYAS: '/wilayas/'
} as const; 