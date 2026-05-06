import { Component } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";

@Component({
  selector: 'app-play',
  imports: [MusicBars],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play { }
