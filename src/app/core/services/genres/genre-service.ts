import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { GenreData, Genres } from '../../interfaces/genres.interface';
import { Observable, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GenreService {

  http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  public genreId = signal<number>(0);

  public genreList = signal<GenreData[]>([]);


  /**
   * Returns all genres: if `genreList` already has data, responds from cache without making an HTTP request; 
   * otherwise, fetches from the API and updates the signal.
   */

  getAllGenres(): Observable<Genres> {
    const cached = this.genreList();
    if (cached.length > 0) {
      return of({ data: [...cached] });
    }

    return this.http.get<Genres>(`${this.apiUrl}/genre`).pipe(
      tap((res) => {
        this.genreList.set(res.data);
      })
    );
  }

}
