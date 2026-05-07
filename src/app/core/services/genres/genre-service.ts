import { inject, Injectable, signal } from '@angular/core';
import { ArtistsService } from './artists-service';

@Injectable({
  providedIn: 'root'
})
export class GenreService {


  readonly artistsService = inject(ArtistsService);
  public artistsListByGenre = signal<string[]>([]);

  isGenreSelected = signal<boolean>(false);

  /**
   * Stores the currently selected genre.
   */
  selectedGenre = signal<string | null>(null);



  getRandomArtistByGenre() {
    const artists = this.artistsListByGenre();
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    this.artistsService.randomArtist.set(randomArtist);
  }
}
