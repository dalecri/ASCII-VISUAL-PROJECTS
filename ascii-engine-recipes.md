# AsciiEngine

`AsciiEngine` is a small, zero-dependency, vanilla JavaScript ASCII rendering and image-sampling library built for local-first, single-file HTML/CSS/JS web apps. Drop `<script src="ascii-engine.js"></script>` into any page to access the global `AsciiEngine` object—no build step, no bundler, and no external imports required.

It supports two distinct workflows:
1. **Procedural Grid Renderer (`AsciiEngine.create`)** — Divides an HTML `<canvas>` into a fixed character grid with per-cell priority layering (`BG` through `TOP`), DPI scaling, colour-batched `fillText` flushing, automatic pause on hidden tabs, and `prefers-reduced-motion` compliance.
2. **Image Sampler (`AsciiEngine.fromImage` & `AsciiEngine.renderToPre`)** — Pure computation that samples an `<img>`, `<video>`, or `<canvas>` into a luminance-mapped character grid (with optional RGB cell colours) and renders it to a `<pre>` element.

> **Accessibility Note:** Host pages should treat procedural ASCII canvases as decorative (`aria-hidden="true"`) and keep real, screen-reader-accessible content in standard HTML elements.

---

## Full API Reference

### Constants

#### `AsciiEngine.PRIORITY`
Named priority constants for layering stamps in procedural mode. Higher numbers win; a stamp never overwrites a cell that already holds an equal or higher priority.
```js
const { BG, LOW, MID, HIGH, FX, TOP } = AsciiEngine.PRIORITY;
// { BG: 0, LOW: 1, MID: 2, HIGH: 3, FX: 4, TOP: 5 }
```

#### `AsciiEngine.RAMPS`
Built-in luminance character ramps ordered from dark to bright.
> **Note:** The `blocks` ramp (`' ░▒▓█'`) uses Unicode block elements rather than strict 7-bit ASCII.
```js
const ramp = AsciiEngine.RAMPS.standard; // ' .:-=+*#%@'
// Also available: .detailed, .minimal, .blocks
```

---

### Grid Renderer (Procedural Mode)

#### `AsciiEngine.create(canvas, options)`
Creates an independent engine instance bound to `canvas`. Multiple engines on the same page operate without shared state.
```js
const engine = AsciiEngine.create(document.getElementById('pond'), {
  cellW: 12,          // px per column
  cellH: 17,          // px per row
  fontSize: 13,
  fontFamily: '"Space Mono", "Courier New", monospace',
  background: '#03070d'
});
```

#### `engine.resize()`
Recomputes `engine.cols` and `engine.rows` for the canvas's current bounding box, updates `devicePixelRatio` transforms, and reallocates the internal grid arrays.
```js
window.addEventListener('resize', () => engine.resize());
```

#### `engine.clear()`
Empties every cell in the preallocated arrays and resets cell priorities to `-Infinity`.
```js
engine.clear();
```

#### `engine.stampCell(gx, gy, char, color, priority)`
Writes `char` to grid coordinates `(gx, gy)` only if the cell is empty or its existing priority is strictly lower than `priority`.
```js
engine.stampCell(10, 5, '@', '#ff6b6b', AsciiEngine.PRIORITY.HIGH);
```

#### `engine.stampPx(x, y, char, color, priority)`
Converts pixel coordinates `(x, y)` to grid coordinates and stamps the cell.
```js
canvas.addEventListener('mousemove', (e) => {
  engine.stampPx(e.offsetX, e.offsetY, 'o', '#72efdd', AsciiEngine.PRIORITY.FX);
});
```

#### `engine.stampText(gx, gy, text, color, priority)`
Writes a string left-to-right starting at `(gx, gy)`, one character per column.
```js
engine.stampText(2, 1, 'KOI POND', '#94a3b8', AsciiEngine.PRIORITY.TOP);
```

#### `engine.render()`
Flushes the current grid buffer to the `<canvas>`, sorting state changes so `ctx.fillStyle` only switches when the cell colour changes.
```js
engine.render();
```

#### `engine.cols` / `engine.rows`
Read-only getters returning the current grid dimensions in character cells.
```js
console.log(`Grid is ${engine.cols}x${engine.rows} cells`);
```

#### `engine.start(callback)` / `engine.stop()`
Starts or stops the `requestAnimationFrame` loop.
- Passes `(engine, timeMs, dtMs)` to `callback` each frame.
- Automatically pauses when `document.hidden` is true.
- Calling `start()` while already running will not spawn a duplicate loop.
- If `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is true, `start()` executes the callback once to render a static frame and does not loop.
```js
engine.start((eng, timeMs, dtMs) => {
  eng.clear();
  eng.stampText(4, 2, 'FRAME TIME: ' + Math.round(timeMs), '#38bdf8', AsciiEngine.PRIORITY.HIGH);
  eng.render();
});

// Later, to halt animation:
engine.stop();
```

#### `engine.toText()`
Returns the current procedural grid state as `{ plain: string, rows: string[] }` so any procedural frame can be saved or exported as plain text.
```js
const snapshot = engine.toText();
console.log(snapshot.plain);
```

---

### Image Sampler (Conversion Mode)

#### `AsciiEngine.fromImage(source, options)`
Samples any `CanvasImageSource` (`<img>`, `<video>`, `<canvas>`) using an offscreen canvas at the target column count. Computes luminance per cell via `0.2126*R + 0.7152*G + 0.0722*B`. Fully transparent pixels (`alpha === 0`) become spaces.
```js
const result = AsciiEngine.fromImage(myImgElement, {
  cols: 80,
  ramp: AsciiEngine.RAMPS.standard,
  color: true,
  invert: false,
  charAspect: 0.55
});
// result => { plain: string, rows: string[], colors: string[][] | null }
```

#### `AsciiEngine.renderToPre(preElement, result)`
Populates a `<pre>` element with `result`. If `result.colors` is present, consecutive characters sharing a colour are wrapped in `<span>` tags.
```js
const pre = document.getElementById('ascii-art');
AsciiEngine.renderToPre(pre, result);
```

---

## Copy-Paste Integration Recipes

### Recipe 1: Animated Background Behind a Page Hero
Creates a full-bleed decorative `<canvas>` behind a hero section, debounces window resizing at 120ms, and runs a layered procedural loop.

```html
<header style="position: relative; height: 360px; overflow: hidden; background: #03070d;">
  <canvas id="hero-canvas" aria-hidden="true"
    style="position: absolute; inset: 0; width: 100%; height: 100%; display: block;"></canvas>
  <div style="position: relative; z-index: 1; padding: 4rem 2rem; color: #f8fafc;">
    <h1>Local-First Software</h1>
  </div>
</header>

<script src="ascii-engine.js"></script>
<script>
  const canvas = document.getElementById('hero-canvas');
  const engine = AsciiEngine.create(canvas, {
    cellW: 12,
    cellH: 17,
    fontSize: 13,
    fontFamily: '"Space Mono", "Courier New", monospace',
    background: '#03070d',
    autoResize: false // handling resize explicitly with 120ms debounce below
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => engine.resize(), 120);
  });

  engine.start((eng, timeMs) => {
    const t = timeMs * 0.001;
    eng.clear();

    for (let y = 0; y < eng.rows; y++) {
      for (let x = 0; x < eng.cols; x++) {
        const wave = Math.sin(x * 0.15 + t) + Math.cos(y * 0.2 - t * 0.6);
        if (wave > 1.2) {
          eng.stampCell(x, y, '~', '#1e3a5f', AsciiEngine.PRIORITY.BG);
        } else if (wave < -1.3) {
          eng.stampCell(x, y, '.', '#0f2238', AsciiEngine.PRIORITY.BG);
        }
      }
    }

    eng.stampText(3, eng.rows - 2, 'KOI', '#38bdf8', AsciiEngine.PRIORITY.TOP);
    eng.render();
  });
</script>
```

---

### Recipe 2: Convert a User-Dropped Photo into a Coloured `<pre>` Portrait
Handles drag-and-drop file loading and converts the image into a coloured `<pre>` block.

```html
<div id="drop-zone" style="border: 1px dashed #334155; padding: 2rem; text-align: center;">
  Drop an image here
</div>
<pre id="portrait-out" style="font: 8px/9px monospace; background: #03070d; padding: 1rem; overflow: auto;"></pre>

<script src="ascii-engine.js"></script>
<script>
  const dropZone = document.getElementById('drop-zone');
  const preOut = document.getElementById('portrait-out');

  dropZone.addEventListener('dragover', (e) => e.preventDefault());
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const img = new Image();
    img.onload = () => {
      const result = AsciiEngine.fromImage(img, {
        cols: 90,
        ramp: AsciiEngine.RAMPS.standard,
        color: true,
        invert: false,
        charAspect: 0.55
      });
      AsciiEngine.renderToPre(preOut, result);
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
</script>
```

---

### Recipe 3: Render a One-Off Static Frame to Plain Text for Saving
Stamps a procedural scene onto an offscreen canvas without starting an animation loop and extracts the plain text string for saving into a journal or `.txt` file.

```html
<button id="export-btn">Download Static ASCII Frame</button>
<pre id="journal-preview"></pre>

<script src="ascii-engine.js"></script>
<script>
  document.getElementById('export-btn').addEventListener('click', () => {
    const scratchCanvas = document.createElement('canvas');
    scratchCanvas.width = 480;
    scratchCanvas.height = 204;

    const engine = AsciiEngine.create(scratchCanvas, { cellW: 12, cellH: 17 });
    engine.clear();

    // Border at LOW priority
    for (let x = 0; x < engine.cols; x++) {
      engine.stampCell(x, 0, '-', '#475569', AsciiEngine.PRIORITY.LOW);
      engine.stampCell(x, engine.rows - 1, '-', '#475569', AsciiEngine.PRIORITY.LOW);
    }

    // Label at TOP priority
    engine.stampText(2, 2, 'JOURNAL SNAPSHOT', '#e2e8f0', AsciiEngine.PRIORITY.TOP);
    engine.render();

    const { plain } = engine.toText();
    document.getElementById('journal-preview').textContent = plain;

    // Trigger a local .txt download
    const blob = new Blob([plain], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'snapshot.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });
</script>
```