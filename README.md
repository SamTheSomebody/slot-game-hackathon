# 5x3 Slot Game take home for a successful job interview

The console provides insight into the game's internal processes. You may notice several instances where sprite sheets are reported as "not found" during loading; this is expected behavior. Optimizing sprite sheet layouts was considered out of scope for this project. The current fallback logic attempts to load a single sprite sheet type (if available); failing that, it tries loading multiple types until a failure occurs.

Additionally, GSAP and event subscriptions do not interact well with hot module reloading, and object cleanup has not been a focus. As a result, you may need to perform a full page reload to restore proper functionality.

## Set-up
### Prerequisites
- **Node.js** v18 or later is recommended. You can check your version with:
  ```
  node --version
  ```
- **npm** (comes with Node.js)

### Install Dependencies
In the project root directory, run:
```
npm install
```
This will install all required packages listed in `package.json`.

### Running the Development Server
To start the app in development mode (with hot reloading):
```
npm run dev
```

### Building for Production
To create an optimized production build:
```
npm run build
```
- The output will be in the `.svelte-kit` and `build` directories.

### Previewing the Production Build
To preview the production build locally:
```
npm run preview
```
- This simulates how the app will run in production.

### Troubleshooting
- **Missing dependencies**: Run `npm install` again if you see module not found errors.
- **Port conflicts**: If the default port is in use, SvelteKit will prompt you to use another port.
- **Asset issues**: All required assets are included in the `static/assets/` directory. If you add new assets, place them here.
- **Environment variables**: This project does not require any special environment variables by default.

### Additional Notes
- For best results, use a modern browser (Chrome, Firefox, Edge, Safari).
- If you encounter issues, try deleting `node_modules` and `package-lock.json`, then reinstalling:
  ```
  rm -rf node_modules package-lock.json
  npm install
  ```

## Features
- 5x3 slot grid with animated spinning reels
- Configurable paylines and paytable
- Win evaluation and basic win animations
- User interface with spin, fast-spin, bet controls, and balance display
- Menu with payline and paytable information
- Parallax background and visual effects (clouds, particles, shaking)
- Mocked data for reels, symbols, and winnings
- TypeScript

## 3rd Party Packages & Tools
- Svelte + SvelteKit (Requirement)
- PixiJS (Requirement)
- GSAP (For tweening + animations)
- Free Texture Packer

## File Structure
- `src/lib/config/` – Game configuration (reels, paylines, paytable, symbols, UI)
- `src/lib/logic/` – Core game logic (payline evaluation)
- `src/lib/pixi/components/` – PixiJS components for rendering, animation and game management
- `src/lib/svelte/components/` – Svelte UI components
- `src/lib/stores/` – Svelte stores for game and bet state
- `src/lib/utility/` – Utility functions (e.g., randomization, easing)
- `static/assets/` – Game and UI assets (backgrounds, symbols, icons)
- `docs/` – Design notes, task list, and initial thoughts

## Future Improvements
- Add bonus rounds
- Add tests
- Enable/disable individual paylines
- Add debug tools (force specific wins, bonus rounds)
- Activate and polish bonus round features
- Add SFX and music, with sound toggles
- Integrate Spine2D animations
- Improve spritesheet loader and asset management
- Optimize for performance (e.g., fast mode disables some animations)
- Polish paytable and tease bonus symbols
See 'docs/task-list.md' for more information.

## Assets Used
[Match-3 Monsters](https://free-game-assets.itch.io/free-monsters-game-assets)
[Hand Painted Parallax Background - Whitewood Vale](https://frostwindz.itch.io/hand-painted-parallax-background-whitewood-vale)
[Jungle Cartoon UI](https://free-game-assets.itch.io/free-jungle-cartoon-gui)
[Google Material Icons](https://fonts.google.com/icons)
