/**
 * Holds app-wide environment values (API base URL, flags).
 *
 * En `ng serve`, el interceptor reescribe `https://api.deezer.com/...` → `/api/deezer/...`.
 * En DevTools verás `http://localhost:4200/api/deezer/genre`; es correcto: Vite (ver `vite.config.mjs`) reenvía
 * esa petición a https://api.deezer.com/genre (mismo endpoint público de Deezer).
 */
export const environment = {
  apiUrl: 'https://api.deezer.com',
  /** Prefijo local; debe coincidir con `server.proxy` en `vite.config.mjs`. */
  deezerDevProxyPrefix: '/api/deezer',
};
