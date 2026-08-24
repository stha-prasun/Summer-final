# Retro Racer — Hot Wheels easter egg mini game

A lightweight, retro / pixel-art, desktop-only car avoidance mini game built as a reusable
client-side React component. JavaScript only (no TypeScript). React + canvas +
`requestAnimationFrame`, zero game-engine dependencies.

## Dependencies

All in `package.json`:

| Package | Type | Purpose |
| --- | --- | --- |
| `react` ^18.3.1 | dependency | UI shell |
| `react-dom` ^18.3.1 | dependency | rendering |
| `vite` ^6 | devDependency | build/dev server |
| `@vitejs/plugin-react` ^4 | devDependency | JSX transform |

No game engine, no UI/CSS framework, no image assets. All sprites are drawn on canvas as
pixel rectangles. The only external asset is the free "Press Start 2P" font (Google Fonts,
OFL license) loaded via CSS `@import`; pixel font falls back to monospace if offline.

Install:

```bash
npm install
```

## Run

```bash
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
node smoke-test.mjs  # headless engine sanity/fairness test
```

## File structure

```
/src
  /components
    /RetroRacer
      RetroRacer.jsx        # React shell: states, keyboard, unmount cleanup
      StartScreen.jsx       # title + Start button + best score
      GameOverScreen.jsx    # final score + Restart + Back to Menu
      HUD.jsx               # top bar: Back | title | Score
      gameEngine.js         # loop, update, spawning, collision, canvas render
      sprites.js            # pixel-art sprite drawing helpers
      constants.js          # canvas/road/lane/speed/difficulty constants
      helpers.js            # rand, clamp, rect collision, drawRect
      best.js               # localStorage best-score (fail-safe)
      styles.css            # all styles scoped under .retro-racer-root
  /pages
    MiniGamePage.jsx        # <RetroRacer onBack={...} />
    MainMenuPage.jsx        # main menu with entry button
  App.jsx                   # state-based navigation (menu <-> game)
  main.jsx / index.css      # app entry + site styles
```

## Component API

```jsx
import RetroRacer from "./components/RetroRacer/RetroRacer.jsx";

<RetroRacer onBack={handleBack} />
```

- `onBack` — called after the game loop is stopped and all listeners are cleaned up.
  The parent decides how to navigate back to the main menu.
- The component is SSR-safe: no `window`/`document` access at module or render time
  (localStorage is read lazily inside a `try/catch`).

## Vite integration

Run the demo: "Play Mini Game" on the menu switches to the game via React state
(`App.jsx`); "Back" returns to the menu. For an existing router, this is all you need:

```jsx
// with react-router (or any router of your choice)
<button onClick={() => navigate("/mini-game")}>Play Mini Game</button>

// route: <Route path="/mini-game" element={<MiniGamePage />} />

// pages/MiniGamePage.jsx
export default function MiniGamePage() {
  return <RetroRacer onBack={() => navigate("/")} />;
}
```

Lazy loading is optional but nice:

```jsx
import { lazy } from "react";
const RetroRacer = lazy(() => import("./components/RetroRacer/RetroRacer.jsx"));
```

## Next.js integration

The page must be a client component; the game only touches browser APIs inside
`useEffect`, so either of these works:

```jsx
// app/mini-game/page.js
"use client";
import dynamic from "next/dynamic";
const RetroRacer = dynamic(() => import("@/components/RetroRacer/RetroRacer"), {
  ssr: false,
});

export default function MiniGamePage() {
  const router = useRouter(); // or useRouter() from 'next/navigation'
  return <RetroRacer onBack={() => router.push("/")} />;
}
```

Main menu button: `router.push("/mini-game")`. Import `RetroRacer/styles.css` from the
component (or from `app/layout.js` — all game styles are scoped under `.retro-racer-root`,
so they cannot leak into the rest of the site).

## Main menu / Back flow

- **Entering:** main menu button renders `MiniGamePage`, which renders `<RetroRacer />`.
- **Leaving:** the HUD "Back" button (visible on all screens incl. game over) calls
  `onBack` after cancelling the animation frame and removing the key/blur listeners.
  Rapid clicks are guarded; unmount mid-game is also cleaned up.

## Controls

| Input | Action |
| --- | --- |
| ArrowLeft / A | move left one lane |
| ArrowRight / D | move right one lane |
| Enter / Space | start (start screen) / restart (game over) |
| P / Escape | pause / resume |
| R | restart (game over) |

Arrow keys are prevented from scrolling the page while the game is mounted. Tab focus
loss / window blur auto-pauses. No touch controls, no audio.

## Game rules

- 3-lane scrolling road, player car near the bottom, lane-based smooth movement.
- Obstacles: static cones, slower traffic cars (0.72x scroll speed → you overtake them),
  striped barriers. They never change lanes.
- Fair spawning: no full 3-lane walls, no same-lane stacking, re-rolls invalid spawns.
- Difficulty ramps with survival time: `speed = min(320, 140 + t·3)` px/s,
  `spawnInterval = max(0.45, 1.05 − t·0.011)` s.
- Score = survival seconds with 1 decimal (e.g. `Score: 24.7s`); best score persisted
  in `localStorage` (fails silently if unavailable).
- Collision: shrunk-rect overlap (small fairness tolerance), instant game over.

## Assumptions made

- Fresh Vite + React (JS) scaffold in this directory (no pre-existing router).
- Canvas logical size 360x560, CSS-scaled and `image-rendering: pixelated`.
- Pause is implemented (spec marked it optional) because desktop + tab-switch edge case.
- No official Hot Wheels artwork or branding used anywhere.

## Testing checklist

- [ ] `npm run build` succeeds with no warnings about TS/config.
- [ ] `node smoke-test.mjs`: all assertions pass (loop stability, score ticks,
      game over, best-score persistence, bot survival ≥ 15s).
- [ ] Main menu loads; "Play Mini Game" opens the game.
- [ ] Start screen shows title, Start (keyboard-focusable), best score when present.
- [ ] Arrows/A/D move between all 3 lanes; page does not scroll; car cannot leave road.
- [ ] Score ticks up with one decimal and stops on crash.
- [ ] Crash shows GAME OVER with final score, Restart and Back to Menu.
- [ ] Cones, traffic cars (visibly slower), and barriers all appear and kill on contact.
- [ ] Spawning never shows an impossible 3-lane wall.
- [ ] Enter/Space start & restart; R restarts; P/Escape pause/unpause; blur auto-pauses.
- [ ] Back button works from start, playing, and game over; return lands on the menu.
- [ ] Best score persists across reload; survives `localStorage` being blocked.
- [ ] Switching tab / unmounting mid-game leaves no running loop or stray listeners
      (check via Performance tab: no RAF churn after leaving).
- [ ] Small desktop window (e.g. 800x600): game scales down, HUD stays usable.