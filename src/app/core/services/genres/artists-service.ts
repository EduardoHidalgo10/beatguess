import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { ArtistData, ArtistResponse } from '../../interfaces/artist.interface';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArtistsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;





  randomArtist = signal<string>('');
  randomSongs = signal<ArtistData[]>([]);

  /**
   * Calls Deezer's search endpoint (`/search`) with the given `q` term.
   *
   * @param artist - Query string sent as `q` (e.g. `linkin park`).
   * @returns Observable of the search response body (tracks in `data`).
   */

  getArtist(artist: string) {
    return this.http.get<ArtistResponse>(`${this.apiUrl}/search?q=${artist}`)
    .pipe(tap((response) => this.randomSongs.set(response.data))
  );
  }
}