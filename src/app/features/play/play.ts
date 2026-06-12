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
  private playedSongIds = new Set<number>();
  private isAdvancingSong = false;

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
    this.playedSongIds.clear();
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
    const hasCurrentSong = Boolean(this.currentSong());
    const hasAudioSource = Boolean(this.audio.src);
    const canResumeCurrentSong = hasCurrentSong && hasAudioSource && this.audioProgress() < 100;

    this.isMusicPlaying = true;
    if (canResumeCurrentSong) {
      this.playCurrentAudio();
      return;
    }

    const nextSong = this.getRandomSong();
    if (!nextSong) {
      this.isMusicPlaying = false;
    }
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
    this.audio.ontimeupdate = null;
    this.audio.src = '';
  }

  getRandomSong(): ArtistData | null {
    const song = this.pickRandomSong();
    if (!song) {
      this.audio.pause();
      this.audio.ontimeupdate = null;
      this.audioProgress.set(0);
      this.currentSong.set(null);
      return null;
    }

    this.playedSongIds.add(song.id);
    this.currentSong.set(song);
    this.audioProgress.set(0);
    this.audio.src = song.preview;
    this.configureAudioProgress();
    this.playCurrentAudio();

    return song;
  }

  private pickRandomSong(): ArtistData | null {
    const tracks = this.artistResource.value()?.data ?? [];
    const withPreview = tracks.filter((t) => t.preview?.trim());

    if (!withPreview.length) return null;

    const unplayed = withPreview.filter((t) => !this.playedSongIds.has(t.id));
    const pool = unplayed.length ? unplayed : withPreview;

    if (!unplayed.length) this.playedSongIds.clear();

    return pool[Math.floor(Math.random() * pool.length)];
  }

  private configureAudioProgress() {
    this.audio.ontimeupdate = () => {
      if (this.audio.currentTime >= this.MAX_DURATION) {
        this.advanceToNextSong();
        return;
      }

      const progress = (this.audio.currentTime / this.MAX_DURATION) * 100;
      this.audioProgress.set(progress);
    };
  }

  private advanceToNextSong() {
    if (this.isAdvancingSong) return;

    this.isAdvancingSong = true;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audioProgress.set(100);

    setTimeout(() => {
      if (this.isMusicPlaying) {
        const nextSong = this.getRandomSong();
        if (!nextSong) {
          this.isMusicPlaying = false;
        }
      }
      this.isAdvancingSong = false;
    }, 0);
  }

  private playCurrentAudio() {
    void this.audio.play().catch(() => {
      this.isMusicPlaying = false;
    });
  }
}
