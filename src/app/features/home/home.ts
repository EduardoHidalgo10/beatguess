import { Component } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";

@Component({
  selector: 'app-home',
  imports: [MusicBars],
  templateUrl: './home.html',
})
export class Home { }
