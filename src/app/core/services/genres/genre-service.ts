import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  
public artistsListByGenre = signal<string[]>([]);

isGenreSelected = signal<boolean>(false);

/**
 * Stores the currently selected genre.
 */
selectedGenre = signal<string | null>(null);
  
}
