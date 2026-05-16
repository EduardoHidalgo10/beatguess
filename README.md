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
5. The player chooses from 4 options generated reactively with `computed()`.
6. **Correct** → confetti fires, streak increments, and a new song loads.
7. **Incorrect** → visual feedback is shown, streak resets, and a new song loads.

---

## Commands

```bash
npm start       # Start the development server
npm test        # Run unit tests with Vitest
```
