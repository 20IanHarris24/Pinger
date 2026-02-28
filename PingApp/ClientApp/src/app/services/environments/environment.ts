// environment.ts development setup for Https. Overwrites the default http:
export const environment = {
  production: false,
  apiBaseUrl: "https://localhost:34011",
  pagingMode: 'server' as 'server' | 'local'
};
