import { Component } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";
import { SongsCards } from "../../ui/components/songs-cards/songs-cards";

@Component({
  selector: 'app-play',
  imports: [MusicBars, SongsCards],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play { }
