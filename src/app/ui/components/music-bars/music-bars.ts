import { Component, computed, input } from '@angular/core';

const HEIGHT_CLASSES = [
  'h-4/5',
  'h-5/6',
  'h-full',
  'h-5/6',
  'h-full',
  'h-4/5',
  'h-5/6',
] as const;

const STEP_MS = 120;


@Component({
  selector: 'app-music-bars',
  imports: [],
  templateUrl: './music-bars.html',
  styleUrl: './music-bars.css',
})
export class MusicBars {
  /**
   * Number of bars to render (minimum 1).
   */
  readonly barsAmount = input<number>(8);

  /**
   * Each bar model: Tailwind classes and animation delay.
   */
  readonly bars = computed(() => {
    const count = Math.max(1, this.barsAmount());
    return Array.from({ length: count }, (_, index) => ({
      heightClass: HEIGHT_CLASSES[index % HEIGHT_CLASSES.length],
      bgClass: index % 2 === 0 ? 'bg-primary' : 'bg-secondary',
      animationDelayMs: index * STEP_MS,
    }));
  });
}
