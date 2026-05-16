import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MusicBars } from "../../ui/components/music-bars/music-bars";
import { SongsCards } from "../../ui/components/songs-cards/songs-cards";
import { ArtistsService } from '../../core/services/genres/artists-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { GenreService } from '../../core/services/genres/genre-service';
import { ArtistData } from '../../core/interfaces/artist.interface';

@Component({
  selector: 'app-play',
  imports: [MusicBars, SongsCards],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements OnDestroy {

  readonly artistsService = inject(ArtistsService);
  readonly genreService = inject(GenreService);

  private readonly MAX_DURATION = 10;

  isMusicPlaying = false;
  currentSong = signal<ArtistData | null>(null);
  audioProgress = signal<number>(0);
  streak = signal<number>(0);
  private audio = new Audio();

  artistResource = rxResource({
    params:() => this.artistsService.randomArtist(),
    stream:({params}) => this.artistsService.getArtist(params),
  })

  changeArtist() {
    this.audio.pause();
    this.isMusicPlaying = false;
    this.audioProgress.set(0);
    this.currentSong.set(null);
    this.streak.set(0);
    this.genreService.getRandomArtistByGenre();
  }

  onCorrectAnswer() {
    this.streak.update((s) => s + 1);
    this.getRandomSong();
  }

  onWrongAnswer() {
    this.streak.set(0);
    this.getRandomSong();
  }

  clickPlayButton() {
    this.isMusicPlaying = true;
    this.getRandomSong();
  }

  clickPauseButton() {
    this.isMusicPlaying = false;
    this.audio.pause();
  }

  /**
   * Selects a random song with an available preview and plays it in the browser.
   * @returns The selected song or null if no previews are available.
   */
  ngOnDestroy() {
    this.audio.pause();
    this.audio.src = '';
  }

  getRandomSong(): ArtistData | null {
    const tracks = this.artistResource.value()?.data ?? [];
    const withPreview = tracks.filter((t) => t.preview?.trim());

    if (!withPreview.length) return null;

    const song = withPreview[Math.floor(Math.random() * withPreview.length)];

    this.currentSong.set(song);
    this.audioProgress.set(0);
    this.audio.src = song.preview;
    this.audio.ontimeupdate = () => {
      if (this.audio.currentTime >= this.MAX_DURATION) {
        this.audio.pause();
        this.isMusicPlaying = false;
        this.audioProgress.set(100);
        return;
      }
      const progress = (this.audio.currentTime / this.MAX_DURATION) * 100;
      this.audioProgress.set(progress);
    };
    this.audio.play();

    return song;
  }
}
