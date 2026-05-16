import { Component, computed, input, output, signal } from '@angular/core';
import confetti from 'canvas-confetti';
import { ArtistData } from '../../../core/interfaces/artist.interface';

@Component({
  selector: 'app-songs-cards',
  imports: [],
  templateUrl: './songs-cards.html',
  styleUrl: './songs-cards.css',
})
export class SongsCards {
  songs = input<ArtistData[]>([]);
  currentSong = input<ArtistData | null>(null);

  nextSong = output<void>();
  resetStreak = output<void>();

  wrongSongId = signal<number | null>(null);

  /**
   * Generates a list of 4 options: the current song plus 3 other random, distinct songs.
   * Shuffles the order to avoid revealing which is the correct option.
   */
  songOptions = computed<ArtistData[]>(() => {
    const all = this.songs();
    const current = this.currentSong();

    if (!current || !all.length) return [];

    const seenTitles = new Set<string>([current.title_short]);
    const others = all
      .filter((s) => s.id !== current.id)
      .filter((s) => {
        if (seenTitles.has(s.title_short)) return false;
        seenTitles.add(s.title_short);
        return true;
      });

    const shuffled = others.sort(() => Math.random() - 0.5);
    const options = [current, ...shuffled.slice(0, 3)];

    return options.sort(() => Math.random() - 0.5);
  });

  /**
   * Evaluates the song selected by the user.
   * If correct, triggers confetti, increases the streak, and requests a new song.
   * If incorrect, resets the streak and starts a new round.
   * @param song - Song selected by the user.
   */
  /**
   * Retorna las clases CSS de una tarjeta según su estado (normal o incorrecto).
   * @param song - Canción de la tarjeta a evaluar.
   */
  cardClasses(song: ArtistData): string {
    const base = 'glass-card flex min-h-28 items-center justify-center font-bold rounded-[10px] border px-5 py-8 text-center font-h2 text-xl transition-all duration-150 cursor-pointer';
    const isWrong = this.wrongSongId() === song.id;
    const dynamic = isWrong
      ? 'border-red-500 bg-red-500/20 text-red-400'
      : 'border-secondary/30 text-on-surface hover:bg-secondary/10 active:scale-95';
    return `${base} ${dynamic}`;
  }

  selectSong(song: ArtistData) {
    if (song.id === this.currentSong()?.id) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      this.nextSong.emit();
    } else {
      this.wrongSongId.set(song.id);
      setTimeout(() => {
        this.wrongSongId.set(null);
        this.resetStreak.emit();
      }, 800);
    }
  }
}
