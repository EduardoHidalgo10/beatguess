import { Component, inject } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";
import { Router, RouterLink } from '@angular/router';
import { GenreCards } from "../../ui/components/genre-cards/genre-cards";
import artistsByGenre from '../../core/data/artists.json';
import { GenreService } from '../../core/services/genres/genre-service';

@Component({
  selector: 'app-home',
  imports: [MusicBars, GenreCards],
  templateUrl: './home.html',
})
export class Home { 
  genreService = inject(GenreService);
  router = inject(Router);


  readonly genresFromArtists: string[] = Object.keys(
    artistsByGenre as Record<string, string[]>
  );



  startPlaying() {
    if (!this.genreService.isGenreSelected()) {
      alert('Please select a genre before starting the game');
      return;
    }
    
    this.router.navigate(['/play']);
  }
}
