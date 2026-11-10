# ASCII Visual Projects

Living pictures made of characters. A collection of small, self-contained ASCII art and simulation pieces by Cristobal D'Alessio: ponds, flocks, weather, attractors, and slow art that runs on real clocks and calendars.

Every piece is a **single HTML file in vanilla JavaScript, with no libraries and no build step**. Open the file and it runs. Most are animated; all respect `prefers-reduced-motion` and pause when the tab is hidden.

**Browse them all from the home page: [index.html](index.html)** (or the live site, once Pages finishes building: `heycristobal.com/ASCII-VISUAL-PROJECTS/`)

---

## Math made visible

Equations you can look at.

| Piece | What it is |
| --- | --- |
| [ASCII Terrain Flyover](ascii-terrain-flyover.html) | Endless fBm mountains in real perspective, shaded by height and slope, with lakes in the valleys and a topographic contour mode. Bank with the mouse. |
| [ASCII Map Generator](ascii-map-generator.html) | Procedural ASCII terrain maps, generated from a seed. Shelved here 2026-10-28 from its own repo during the consolidation. |
| [Wave Interference Table](wave-interference-table.html) | Draggable ripple sources on dark water. Crests, troughs, and the quiet nodal threads where waves cancel each other. Optional phosphor afterglow. |
| [Kaleidoscope Loom](kaleidoscope-loom.html) | Noise folded through mirror symmetry into living mandalas. 4 to 16 segments, three palettes, and a symmetry centre that follows your hand. |
| [Reaction-Diffusion Garden](reaction-diffusion-garden.html) | Gray-Scott chemistry blooming into coral, spots, and mazes. Click to seed it and watch it grow. Five presets (Coral, Mitosis, Leopard Spots, Maze, Slow Waves). |
| [Murmuration](murmuration.html) | Two hundred starlings as glyphs over a dusk sky, flocking by the three boids rules. Click for a hawk scare; pick Ribbon, Swirl, or Scatter moods. |

## Ambient & slow art

Pieces that run on real time: clocks, weather, seasons.

| Piece | What it is |
| --- | --- |
| [ASCII Aurora](ascii-aurora.html) | Value-noise aurora curtains with fine vertical rays over a twinkling starfield and a treeline. Storm-strength slider, three palettes. |
| [Seasonal Tree](seasonal-tree.html) | One seeded tree living by the real calendar: spring growth, summer canopy, mottled autumn fall, snowy bare branches. Scrub the year or play it in a minute. |
| [Rain on Glass](rain-on-glass.html) | A fogged window in the rain. Drops gather, run down wiggly trails, and wipe the view clear before it mists over again. Three scenes behind the glass. |
| [Life Clock](life_clock.html) | The current time stamped into a running Game of Life, fraying and regrowing every minute, with age-coloured cells and fade trails. A screensaver clock. |

## Ponds, portraits & toys

The ones that started it, plus the playful ones.

| Piece | What it is |
| --- | --- |
| [Full Koi Pond](ascii-fish/) | The full six-koi pond as a split build (index + css + js): procedural Nishikigoi with their own patch patterns, a current-speed slider (0.2x-2.5x), and click ripples that scatter the fish. |
| [Little Vale](little-vale.html) | A cozy ASCII game with a day/night cycle, lantern lighting, rain, fishing log and four hidden cats. Rebuilt 2026-11-08 (v2); first shelved here 2026-10-28 from the ascii-cozy-game repo. |
| [Cozy Game of Life](cozy_game_of_life.html) | A warm little Life universe. Plant seeds by drawing, pick a palette (Twilight Forest, Moss, Warm Hearth, Midnight Tide), set the pace, and let gliders roam a wrap-around world. |
| [Ocean in a Bottle](ocean-in-a-bottle.html) | Spring-physics seawater sloshing inside a character-drawn bottle. Tilt it with the pointer or the device, shake it, watch the droplets. |
| [ASCII Photo Booth](ascii_photo_booth.html) | Drop in a photo, get ASCII back: three character ramps, colour / palette / mono modes, copy-as-text and PNG export. Works on cats. |
| [ASCII Spinner](ascii_spinner.html) | donut.c-style real-time 3D in text: torus, cube, and sphere with a z-buffer and luminance shading. Drag to orbit; it keeps its momentum. |

## Toolbox

| File | What it is |
| --- | --- |
| [ascii_rendering_engine.js](ascii_rendering_engine.js) | The reusable ASCII engine the pond grew into: a procedural stamp-grid renderer plus an image sampler (luminance ramps, copyable text output), with demo recipes in its header comments. |
| [AsciiEngine Demo](ascii-engine-demo.html) | The demo page for the shared rendering engine, shelved 2026-10-28 from the ascii-engine repo (whose engine file was already byte-identical to the copy here); recipe notes at [ascii-engine-recipes.md](ascii-engine-recipes.md). |

## On the bench

Prompted and spec'd, not yet built: Falling-Sand Zen Box, Strange Attractor Portrait, Tide Clock, Fireflies over the Marsh, Glyph Painter.

## Archive

Retired from the collection, kept for reference.

| Piece | What it is |
| --- | --- |
| [Weather Pond](archive/weather_pond.html) | The live-weather pond (archived Nov 8, 2026): four named koi (Kohaku, Sanke, Ogon, Utsuri) mirroring LaBelle's real weather via Open-Meteo. Felt too close to the other ponds to keep in the collection. |

## Notes

- No trackers, no accounts, no network calls.
- Styling follows the Quiet Pixel guide: dark soft-purple grounds, rounded panels, Space Mono, one accent per screen.

## Original build prompt: ASCII Photo Booth

Build a single-file HTML app called "ASCII Photo Booth" in vanilla JavaScript with no libraries and no CDN links. The user drops an image file onto the page (or picks one with a file input) and the app converts it live into ASCII art on a canvas. Everything runs locally in the browser; the image is never uploaded anywhere.

How the conversion works:
- Draw the image to an offscreen canvas scaled down to a grid (default about 120 columns). For each cell, sample the average brightness and pick a character from the ramp " .:-=+*#%@" (space for brightest, @ for darkest). Correct for the fact that characters are taller than wide (cell height about 2x cell width) so the output is not stretched.
- Render the grid as text on a visible canvas or in a pre element with a monospace font.

Controls:
- Detail slider (columns from 40 to 240).
- Character set picker: Classic (" .:-=+*#%@"), Blocks (" ░▒▓█"), Minimal (" .:+#").
- Colour mode picker: Original (each character drawn in the sampled pixel colour), Mono (one cream colour on dark), Palette (snap each colour to the nearest of a fixed palette: deep purple background #1E1826, lavender #9B8FA8, near-white #EDE7F2, amber #E8873A, yellow #F2C94C, blue #7FB8D9, pink #E85C8A).
- Contrast slider.
- Buttons: "Copy as text" (copies the plain character grid to the clipboard) and "Download PNG" (saves the rendered canvas).

Style: dark soft-purple page background #1E1826, panels #2A2233 with 14px rounded corners, Space Mono font with a system monospace fallback, one amber accent #E8873A for buttons and sliders. Keep the layout to one screen: drop zone at top, controls in a single row or sidebar, output filling the rest. Respect prefers-reduced-motion (no animations needed anyway). Make it work by just opening the file, no build step.

## Original build prompt: Weather Pond

Build a single-file HTML page called "Weather Pond" in vanilla JavaScript with no libraries and no CDN links. It is an animated ASCII koi pond that reacts to the real current weather in LaBelle, Quebec.

The pond engine:
- Render on a full-screen canvas as a grid of monospace character cells (about 12px wide, 17px tall, Courier New or monospace, characters baseline-aligned, drawn with fillText). Dark transparent-friendly background #030810.
- 4 koi fish. Each fish is a spine chain of 20 to 27 point segments that follow the head with a fixed spacing, and the body undulates with a sine wave whose phase travels down the spine. Draw each segment as a character chosen from the segment's pattern colour and brightness (characters like #, *, +, and : work well), so the fish read as patterned koi: orange and white (Kohaku), white with red and black (Sanke), gold (Ogon), and pale grey (Utsuri).
- Fish wander with smooth steering, avoid the edges, and cruise at a base speed multiplied by a global speed value.
- Clicking or tapping spawns an expanding ripple ring of characters (use . o O style rings) and nearby fish dart away with a short speed burst.

The weather layer:
- On load, and again every 15 minutes, fetch the current weather from the free Open-Meteo API (no key needed): https://api.open-meteo.com/v1/forecast?latitude=46.2883&longitude=-74.7756&current=temperature_2m,weather_code,wind_speed_10m&timezone=America%2FToronto
- Map the weather_code to pond behaviour:
  - Clear (0, 1): calm. Fish at base speed, occasional gentle ripples only.
  - Cloudy (2, 3): slightly slower fish, grey-er light (dim all character colours about 15%).
  - Rain (51, 53, 55, 61, 63, 65, 80, 81, 82): rain characters ( ' and | ) fall through the grid, random small ripples spawn constantly, fish get a little skittish (more darting).
  - Snow (71, 73, 75, 77, 85, 86): snow characters ( * and . ) drift down slowly with a sideways sway, fish slow to about 60% speed.
  - Thunderstorm (95, 96, 99): rain behaviour plus an occasional brief flash (brighten the whole scene for one or two frames every 8 to 20 seconds) and all fish scatter at each flash.
  - Wind: wind_speed_10m adds a sideways current that pushes ripples and biases fish drift direction.
- Show a small readout in one corner, in Space Mono or monospace: "LaBelle -4°C, light snow" style, using the fetched temperature and a plain-language label for the code.
- If the fetch fails, fall back to calm clear behaviour and show "weather unavailable" in the readout. Never leave the pond blank because of a failed fetch.
- Respect prefers-reduced-motion by drawing one static frame. Pause the animation when the tab is hidden.

## Original build prompt: Life Clock

Build a single-file HTML page called "Life Clock" in vanilla JavaScript with no libraries and no CDN links. It is a fullscreen screensaver: a Conway's Game of Life simulation running on a character grid, with the current time living inside the simulation.

How it works:
- Cover the whole window with a canvas grid of cells (cell pitch about 22px, cells drawn as rounded squares with a 4px gap, on a deep purple board #17121E). Run classic Game of Life rules (B3/S23) with wrap-around edges at about 8 generations per second, with short fade trails so dying cells dim over a few frames instead of vanishing.
- Live cells are coloured from a cozy palette by age: amber (245,215,153), cream (250,230,182), honey (238,188,128), rose (229,168,178), sage (168,204,179).
- The time: every minute, stamp the current time as HH:MM into the centre of the grid using a chunky 5x7 pixel font for the digits and colon, setting those cells alive, then let the simulation keep evolving around and through the digits. Re-stamp each minute so the time stays readable while the edges fray and regrow. Under the time, stamp the date in a smaller 3x5 font the same way.
- Ambient life: seed a few gliders and blinkers away from the centre, and if the total population drops too low, sprinkle a small random soup patch in a corner.
- Interaction: click or press any key to pause or resume. Hide the mouse cursor after 3 seconds of no movement. A tiny hint line ("click to pause") fades out after 5 seconds and never comes back.
- Use the real local time from the visitor's clock (Date object). Update the stamp exactly on the minute change.
- Respect prefers-reduced-motion by drawing one static frame of the stamped time with no simulation. Pause when the tab is hidden. Make it work by just opening the file, no build step.

Style: quiet and dark, no panels, no text other than the hint line. The grid is the whole page.

## Original build prompt: ASCII Spinner

Build a single-file HTML app called "ASCII Spinner" in vanilla JavaScript with no libraries and no CDN links. It renders a rotating 3D object as ASCII art in real time, in the style of the classic donut.c.

How it works:
- Render into a pre element (or canvas) as a grid of characters, about 140 columns wide, using the luminance ramp ".,-~:;=!*#$@" (dot for dimmest, @ for brightest).
- Do real 3D math per frame: define the object's surface points, rotate them around two axes with rotation angles that advance each frame, project them to 2D with simple perspective, keep a z-buffer so nearer points win, and compute each point's brightness from its surface normal dotted with a fixed light direction. Map brightness to the ramp.
- Object picker with three objects:
  - Torus (the classic donut): sample points around both circles of a torus with radii R1=1, R2=2.
  - Cube: sample points evenly across the six faces.
  - Sphere: sample points on a sphere with even spacing.
- Controls: speed slider (0 to 3x, default 1x), Detail slider (character grid size), Colour toggle: Mono (cream text on dark) or Palette (colour each character by brightness from deep purple through pink to amber to cream).
- Dragging on the art with the mouse or finger grabs the spin: horizontal drag adds spin velocity, and it keeps its momentum when released.
- Click the Pause button (or press space) to freeze a frame.

Style: dark soft-purple page background #1E1826, the art in a #2A2233 panel with 14px rounded corners, Space Mono font with a system monospace fallback, one amber accent #E8873A for controls. Respect prefers-reduced-motion by showing one static frame. Make it work by just opening the file, no build step.
