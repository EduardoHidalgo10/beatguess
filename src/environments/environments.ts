/**
 * Holds app-wide environment values (API base URL, flags).
 *
 * The app calls Deezer through the local `/api/deezer` path to avoid browser CORS issues.
 * - In local development, Vite proxy (see `vite.config.mjs`) forwards `/api/deezer/*` to Deezer.
 * - In Netlify production, `_redirects` forwards `/api/deezer/*` to Deezer.
 */
export const environment = {
  apiUrl: '/api/deezer',
  /** Local proxy prefix; it must match `server.proxy` in `vite.config.mjs`. */
  deezerDevProxyPrefix: '/api/deezer',
};
