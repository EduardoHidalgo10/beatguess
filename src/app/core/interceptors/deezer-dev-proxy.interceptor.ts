import { isDevMode } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environments';

/**
 * En desarrollo, reescribe URLs `https://api.deezer.com/...` hacia `/api/deezer/...` para que el dev server proxee a Deezer y el navegador no aplique CORS.
 */
export const deezerDevProxyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isDevMode()) {
    return next(req);
  }

  const base = environment.apiUrl.replace(/\/$/, '');
  if (!req.url.startsWith(base)) {
    return next(req);
  }

  const tail = req.url.slice(base.length) || '/';
  const normalized = tail.startsWith('/') ? tail : `/${tail}`;
  const proxyUrl = `${environment.deezerDevProxyPrefix}${normalized}`;
  return next(req.clone({ url: proxyUrl }));
};
