import { Component, inject } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";
import { SongsCards } from "../../ui/components/songs-cards/songs-cards";
import { ArtistsService } from '../../core/services/genres/artists-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreService } from '../../core/services/genres/genre-service';

@Component({
  selector: 'app-play',
  imports: [MusicBars, SongsCards],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play  {

  readonly artistsService = inject(ArtistsService);
  readonly genreService = inject(GenreService);

  
  artistResource = rxResource({
    params:() => this.artistsService.randomArtist(),
    stream:({params}) => this.artistsService.getArtist(params),
  })


  changeArtist() {
    this.genreService.getRandomArtistByGenre();
    this.artistResource.reload();
  }

  
 }
