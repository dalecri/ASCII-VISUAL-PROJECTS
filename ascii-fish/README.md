# ASCII Koi Pond

A full-screen koi pond drawn entirely in monospace characters. Six procedural Nishikigoi swim behind a minimal foreground text block, each one built from a follow-the-leader spine with lateral undulation that grows toward the tail, procedural colour patches, pectoral fins, eyes, and a billowing tail fin, all rasterized onto a character grid on canvas.

No build step, no dependencies. Vanilla HTML, CSS, and JS.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## How to use

- **Watch:** the six koi (Kohaku, Taisho Sanke, Showa Sanshoku, Yamabuki Ogon, Shiro Utsuri, and Benigoi) wander on their own, steering softly away from the edges.
- **Click or tap the pond** to spawn a ripple. Koi within range scatter from the epicentre with a short speed burst. Up to 12 ripples can be active at once.
- **Current Speed slider** sets the global swim speed, from 0.2x to 2.5x (default 1.0x). Clicking the slider does not spawn a ripple.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Markup only: the background canvas, the foreground text block, and the speed control. Loads `css/style.css` and `js/app.js`. |
| `css/style.css` | All styling: the dark pond base, fixed canvas layer, foreground overlay, speed control panel and slider, and the mobile breakpoint at 600px. |
| `js/app.js` | All behaviour: the character grid, the six procedural koi (spine kinematics, colour patterns, fins and tails), water texture, click ripples, the animation loop, and resize handling. |

## Design notes

- **Character grid:** the pond is a 12 x 17 px cell grid rendered in 13px Courier New. Body density is expressed in characters: `#` / `%` at the core, `X` / `S` at mid-body, `o` at the contour, `:` at the rim.
- **Procedural koi:** each fish has 20 to 27 spine segments, its own thickness, speed, and patch seeds, so no two colour patterns repeat. Colour comes from layered harmonics over the fish's base, patch, and accent colours, dimmed toward the body edge.
- **Ripples:** expanding, vertically compressed rings that fade through a small character set as they age. They are stamped above the fish on the grid.
- **Reduced motion:** if the system requests `prefers-reduced-motion`, the pond draws a single static frame instead of running the animation loop.
