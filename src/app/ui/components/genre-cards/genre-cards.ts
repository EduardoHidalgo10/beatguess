import { Component, input } from '@angular/core';
import { GenreData } from '../../../core/interfaces/genres.interface';

@Component({
  selector: 'app-genre-cards',
  imports: [],
  templateUrl: './genre-cards.html',
  styleUrl: './genre-cards.css',
})
export class GenreCards { 

  genresList = input<GenreData[]>([]);
}
