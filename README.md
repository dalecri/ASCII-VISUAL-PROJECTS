# ASCII Visual Projects

Living pictures made of characters. A collection of small, self-contained ASCII art and simulation pieces by Cristobal D'Alessio: ponds, flocks, weather, attractors, and slow art that runs on real clocks and calendars.

Every piece is a **single HTML file in vanilla JavaScript, with no libraries and no build step**. Open the file and it runs. Most are animated; all respect `prefers-reduced-motion` and pause when the tab is hidden.

**Browse them all from the home page: [index.html](index.html)** (or the live site, once Pages finishes building: `heycristobal.com/ASCII-VISUAL-PROJECTS/`)

---

## Emergent systems

Patterns nobody drew; they grow out of simple rules.

| Piece | What it is |
| --- | --- |
| [Reaction-Diffusion Garden](reaction-diffusion-garden.html) | Gray-Scott chemistry blooming into coral, spots, and mazes. Click to seed it and watch it grow. Five presets (Coral, Mitosis, Leopard Spots, Maze, Slow Waves). |
| [Murmuration](murmuration.html) | Two hundred starlings as glyphs over a dusk sky, flocking by the three boids rules. Click for a hawk scare; pick Ribbon, Swirl, or Scatter moods. |

## Math made visible

Equations you can look at.

| Piece | What it is |
| --- | --- |
| [ASCII Terrain Flyover](ascii-terrain-flyover.html) | Endless fBm mountains in real perspective, shaded by height and slope, with lakes in the valleys and a topographic contour mode. Bank with the mouse. |
| [ASCII Map Generator](ascii-map-generator.html) | Procedural ASCII terrain maps, generated from a seed. Shelved here 2026-10-28 from its own repo during the consolidation. |
| [Wave Interference Table](wave-interference-table.html) | Draggable ripple sources on dark water. Crests, troughs, and the quiet nodal threads where waves cancel each other. Optional phosphor afterglow. |
| [Kaleidoscope Loom](kaleidoscope-loom.html) | Noise folded through mirror symmetry into living mandalas. 4 to 16 segments, three palettes, and a symmetry centre that follows your hand. |

## Ambient & slow art

Pieces that run on real time: clocks, weather, seasons.

| Piece | What it is |
| --- | --- |
| [ASCII Aurora](ascii-aurora.html) | Value-noise aurora curtains with fine vertical rays over a twinkling starfield and a treeline. Storm-strength slider, three palettes. |
| [Seasonal Tree](seasonal-tree.html) | One seeded tree living by the real calendar: spring growth, summer canopy, mottled autumn fall, snowy bare branches. Scrub the year or play it in a minute. |
| [Rain on Glass](rain-on-glass.html) | A fogged window in the rain. Drops gather, run down wiggly trails, and wipe the view clear before it mists over again. Three scenes behind the glass. |
| [Life Clock](life_clock.html) | The current time stamped into a running Game of Life, fraying and regrowing every minute, with age-coloured cells and fade trails. A screensaver clock. |
| [Weather Pond](weather_pond.html) | A koi pond that reads LaBelle, Quebec's real weather (Open-Meteo, no key): rain, snow, thunderstorms, and wind all change the pond's behaviour. |

## Ponds, portraits & toys

The ones that started it, plus the playful ones.

| Piece | What it is |
| --- | --- |
| [ASCII Koi Pond](ascii_koi_pond.html) | The original pond: patterned koi on sine-wave spines, click ripples, scattered petals. |
| [Botanical Koi Portfolio](interactive_ascii_botanical_koi_portfolio.html) | The landing page that kicked the whole series off: an ASCII botanical pond hero with a full vibe studio (palettes, glyph sets, koi count and speed, feeding). |
| [Cozy Game of Life](cozy_game_of_life.html) | A warm little Life universe. Plant seeds by drawing, pick a palette (Twilight Forest, Moss, Warm Hearth, Midnight Tide), set the pace, and let gliders roam a wrap-around world. |
| [Ocean in a Bottle](ocean-in-a-bottle.html) | Spring-physics seawater sloshing inside a character-drawn bottle. Tilt it with the pointer or the device, shake it, watch the droplets. |
| [ASCII Photo Booth](ascii_photo_booth.html) | Drop in a photo, get ASCII back: three character ramps, colour / palette / mono modes, copy-as-text and PNG export. Works on cats. |
| [ASCII Spinner](ascii_spinner.html) | donut.c-style real-time 3D in text: torus, cube, and sphere with a z-buffer and luminance shading. Drag to orbit; it keeps its momentum. |

## Toolbox

| File | What it is |
| --- | --- |
| [ascii_rendering_engine.js](ascii_rendering_engine.js) | The reusable ASCII engine the pond grew into: a procedural stamp-grid renderer plus an image sampler (luminance ramps, copyable text output), with demo recipes in its header comments. |

## On the bench

Prompted and spec'd, not yet built: Falling-Sand Zen Box, Strange Attractor Portrait, Tide Clock, Fireflies over the Marsh, Glyph Painter.

## Notes

- No trackers, no accounts, no network calls except Weather Pond's keyless Open-Meteo fetch.
- Styling follows the Quiet Pixel guide: dark soft-purple grounds, rounded panels, Space Mono, one accent per screen.
