import { Component, inject } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";
import { RouterLink } from '@angular/router';
import { GenreService } from '../../core/services/genres/genre-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreCards } from "../../ui/components/genre-cards/genre-cards";

@Component({
  selector: 'app-home',
  imports: [MusicBars, RouterLink, GenreCards],
  templateUrl: './home.html',
})
export class Home { 

  //Imports
  genreService = inject(GenreService);


  genreResource = rxResource({
    stream:() => this.genreService.getAllGenres(),
  })
}
