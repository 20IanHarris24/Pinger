// environment.prod.ts - Docker / NAS / production
export const environment = {
  production: true,
  apiBaseUrl: "",
  signalRUrl: "/display",
  pagingMode: 'server' as 'server' | 'local'
};
