# BeatGuess

BeatGuess is a music guessing game. The player selects a music genre, listens to a 10-second song preview, and must choose the correct title from 4 options. Correct answers increase a streak; wrong ones reset it.

---

## Technologies

- **Angular 21.1**
- **TailwindCSS 4**
- **RxJS 7.8**
- **Deezer API**
- **canvas-confetti**

---

## Architecture

The project follows a modular architecture with clear separation of concerns:

```
src/app/
├── core/
│   ├── data/          # Static JSON with artists by genre
│   ├── guards/        # Route guards
│   ├── interceptors/  # HTTP interceptor for Deezer dev proxy
│   ├── interfaces/    # TypeScript models and interfaces
│   └── services/      # State management and API communication
├── features/
│   ├── home/          # Genre selection screen
│   └── play/          # Main game screen
├── layout/            # Base visual structure (AppLayout)
├── shared/            # Shared components (Navbar)
└── ui/
    └── components/    # Reusable UI components
        ├── genre-cards/
        ├── music-bars/
        └── songs-cards/
```

### Main layers

| Layer | Responsibility |
|---|---|
| `core/services` | Global application state and HTTP calls |
| `features` | Pages that orchestrate the game logic |
| `ui/components` | Presentational components with no business logic |
| `core/interceptors` | URL rewriting in development to avoid CORS |

---

## Signal-Based Architecture

The application is built **entirely on Angular's Signals system**, avoiding the use of `BehaviorSubject` or manual `ChangeDetectionStrategy`.

### Signal types in use

| Signal | Usage in the app |
|---|---|
| `signal()` | Mutable local state: active song, audio progress, streak, selected genre |
| `computed()` | Reactive derivation: generates the 4 answer options from the current song |
| `input()` | Signal-based component inputs (replaces `@Input()`) |
| `output()` | Signal-based component outputs (replaces `@Output()`) |
| `rxResource()` | Bridge between RxJS and signals: reactively loads artist songs |

---

## Music API — Deezer

The application consumes the **[Deezer API](https://developers.deezer.com/api)** through its search endpoint:

```
GET https://api.deezer.com/search?q={artist}
```

Each result includes track metadata (title, duration, cover art) and a **30-second preview URL**. BeatGuess plays only the first **10 seconds** of that preview.

In development, an HTTP interceptor (`deezerDevProxyInterceptor`) rewrites URLs to a local proxy to bypass browser CORS restrictions.

---

## Game Flow

1. The player selects a genre on the home screen.
2. A random artist is picked from the selected genre (local data from `artists.json`).
3. The Deezer API is queried with the artist's name to fetch their tracks.
4. A 10-second preview of a random song starts playing.
5. The player can pause and resume the same song while progress is below the 10-second limit.
6. When the preview reaches 10 seconds, playback advances automatically to the next random song.
7. The player chooses from 4 options generated reactively with `computed()`.
8. **Correct** → confetti fires, streak increments, and a new song loads.
9. **Incorrect** → visual feedback is shown, streak resets, and a new song loads.

---

## Component & Service Walkthrough

### Entry and layout components

- **`App`** (`src/app/app.ts`) renders the root `router-outlet` and delegates all screen composition to routing.
- **`AppLayout`** (`src/app/layout/app-layout/app-layout.ts`) provides the base shell for every page (navbar + main content).
- **`Navbar`** (`src/app/shared/components/navbar/navbar.ts`) displays the fixed header and routes users back to home.

### Feature components

- **`Home`** (`src/app/features/home/home.ts`)
  - Reads genres from `artists.json`.
  - Displays `GenreCards` to choose a genre.
  - Enables the "Start Playing" button only when a genre is selected.
  - Navigates to `/play`.
- **`Play`** (`src/app/features/play/play.ts`)
  - Observes the selected random artist via signals and loads songs with `rxResource()`.
  - Controls audio play/pause, resumes the same song when paused, and enforces the 10-second preview limit.
  - Advances automatically to the next song when the 10-second limit is reached.
  - Handles playback failures and keeps UI state synchronized when audio cannot start.
  - Tracks progress and streak state.
  - Uses `SongsCards` to evaluate user answers.

### Reusable UI components

- **`GenreCards`** (`src/app/ui/components/genre-cards/genre-cards.ts`) emits genre selection intent by updating shared state in `GenreService`.
- **`SongsCards`** (`src/app/ui/components/songs-cards/songs-cards.ts`) builds 4 options (1 correct + 3 distractors), handles selection, and emits game events.
- **`MusicBars`** (`src/app/ui/components/music-bars/music-bars.ts`) renders animated visual bars used in both home and play screens.

### Services and cross-cutting logic

- **`GenreService`** (`src/app/core/services/genres/genre-service.ts`)
  - Stores selected genre state.
  - Stores the artist list for the selected genre.
  - Picks and exposes a random artist for the next round.
- **`ArtistsService`** (`src/app/core/services/genres/artists-service.ts`)
  - Stores current random artist and fetched songs.
  - Calls Deezer search endpoint for artist tracks.
- **`GuessSongsGuard`** (`src/app/core/guards/guess-songs.guard.ts`) blocks `/play` access when no genre has been selected.
- **`deezerDevProxyInterceptor`** (`src/app/core/interceptors/deezer-dev-proxy.interceptor.ts`) rewrites API URLs in development to avoid CORS.

### End-to-end runtime flow

1. User opens `Home`.
2. User selects a genre in `GenreCards`.
3. `GenreService` stores the genre and picks a random artist.
4. User clicks "Start Playing".
5. Route guard validates that genre selection exists.
6. `Play` requests artist songs through `ArtistsService`.
7. `Play` selects a preview-capable song and starts playback.
8. User can pause and resume the same song before reaching the 10-second limit.
9. `Play` auto-advances when the 10-second limit is reached.
10. `SongsCards` emits correct/incorrect events, and `Play` updates streak and loads the next round.

---

## Commands

```bash
npm start       # Start the development server
npm test        # Run unit tests with Vitest
```
