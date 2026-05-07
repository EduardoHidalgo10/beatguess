import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { GenreService } from '../services/genres/genre-service';

export const GuessSongsGuard: CanActivateFn = (
) => {
    const genreService = inject(GenreService);
    const router = inject(Router);

    if (!genreService.isGenreSelected()) {
        router.navigate(['']);
        return false;
    }
    return true;
};