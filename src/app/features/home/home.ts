import { Component } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MusicBars, RouterLink],
  templateUrl: './home.html',
})
export class Home { }
