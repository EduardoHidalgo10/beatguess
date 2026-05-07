import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import artistsByGenre from '../../../core/data/artists.json';
import { GenreService } from '../../../core/services/genres/genre-service';

const ARTISTS_BY_GENRE = artistsByGenre as Record<string, string[]>;

@Component({
  selector: 'app-genre-cards',
  imports: [CommonModule],
  templateUrl: './genre-cards.html',
  styleUrl: './genre-cards.css',
})
export class GenreCards { 

  genresList = input<string[]>([]);

  readonly genreService = inject(GenreService);

  getGenreName(genreIndex: number){
    const genreName = this.genresList()[genreIndex];
    this.genreService.artistsListByGenre.set(genreName ? (ARTISTS_BY_GENRE[genreName] ?? []) : []);
    this.genreService.isGenreSelected.set(Boolean(genreName));
    this.genreService.selectedGenre.set(genreName ?? null);
  }
}
