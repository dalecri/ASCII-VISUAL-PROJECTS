/**
 * AsciiEngine — Small, reusable, zero-dependency ASCII rendering & sampling engine.
 * Designed for local-first, vanilla HTML/CSS/JS projects with no build step.
 * Exposes a single global: window.AsciiEngine
 */
(function (global) {
  'use strict';

  // ============================================================================
  // 1. CONSTANTS & NAMED LEVELS
  // ============================================================================

  var PRIORITY = {
    BG: 0,
    LOW: 1,
    MID: 2,
    HIGH: 3,
    FX: 4,
    TOP: 5
  };

  var RAMPS = {
    standard: ' .:-=+*#%@',
    detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
    minimal:  ' .+#@',
    blocks:   ' ░▒▓█'
  };

  var DEFAULTS = {
    cellW: 12,
    cellH: 17,
    fontSize: 13,
    fontFamily: '"Space Mono", "Courier New", monospace',
    background: '#03070d',
    autoResize: true,
    resizeDebounceMs: 120
  };

  // ============================================================================
  // 2. GRID RENDERER (PROCEDURAL MODE)
  // ============================================================================

  function create(canvas, options) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new Error('AsciiEngine.create requires a valid HTMLCanvasElement.');
    }

    var opts = Object.assign({}, DEFAULTS, options || {});
    var ctx = canvas.getContext('2d');

    var cellW = Number(opts.cellW) || DEFAULTS.cellW;
    var cellH = Number(opts.cellH) || DEFAULTS.cellH;
    var fontSize = Number(opts.fontSize) || DEFAULTS.fontSize;
    var fontFamily = opts.fontFamily || DEFAULTS.fontFamily;
    var background = opts.background !== undefined ? opts.background : DEFAULTS.background;

    var cols = 0;
    var rows = 0;
    var cssWidth = 0;
    var cssHeight = 0;

    // Parallel preallocated grid arrays
    // Grid 1: characters (Array of strings) & priorities (Float64Array so -Infinity works)
    // Grid 2: colours (Array of CSS colour strings)
    var chars = [];
    var priorities = new Float64Array(0);
    var colors = [];

    // Animation loop state
    var rafId = null;
    var isRunning = false;
    var frameCallback = null;
    var lastFrameTime = 0;
    var elapsedTotal = 0;
    var resizeTimer = null;

    /**
     * Recompute cols/rows for the current canvas size, configure DPI scaling,
     * and reallocate the parallel grid arrays only when dimensions change.
     */
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = global.devicePixelRatio || 1;

      cssWidth = rect.width || canvas.clientWidth || Number(canvas.getAttribute('width')) || 300;
      cssHeight = rect.height || canvas.clientHeight || Number(canvas.getAttribute('height')) || 150;

      var targetWidth = Math.max(1, Math.round(cssWidth * dpr));
      var targetHeight = Math.max(1, Math.round(cssHeight * dpr));

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = fontSize + 'px ' + fontFamily;
      ctx.textBaseline = 'top';

      var newCols = Math.max(1, Math.floor(cssWidth / cellW));
      var newRows = Math.max(1, Math.floor(cssHeight / cellH));

      if (newCols !== cols || newRows !== rows) {
        cols = newCols;
        rows = newRows;
        var totalCells = cols * rows;
        chars = new Array(totalCells);
        colors = new Array(totalCells);
        priorities = new Float64Array(totalCells);
      }

      clear();
    }

    /**
     * Empty every cell and reset all priorities in the preallocated arrays.
     */
    function clear() {
      var total = cols * rows;
      for (var i = 0; i < total; i++) {
        chars[i] = ' ';
        colors[i] = '';
        priorities[i] = -Infinity;
      }
    }

    /**
     * Write a single character to cell (gx, gy) if the cell is empty or has a strictly
     * lower priority than `priority`. Never overwrites equal or higher priority.
     */
    function stampCell(gx, gy, char, color, priority) {
      var x = gx | 0;
      var y = gy | 0;
      if (x < 0 || x >= cols || y < 0 || y >= rows) return;
      if (!char) return;

      var prio = priority !== undefined ? Number(priority) : PRIORITY.BG;
      var idx = y * cols + x;

      if (prio > priorities[idx]) {
        chars[idx] = String(char).charAt(0);
        colors[idx] = color || '#ffffff';
        priorities[idx] = prio;
      }
    }

    /**
     * Convert pixel coordinates (x, y) to grid coordinates and stamp.
     */
    function stampPx(x, y, char, color, priority) {
      var gx = Math.floor(x / cellW);
      var gy = Math.floor(y / cellH);
      stampCell(gx, gy, char, color, priority);
    }

    /**
     * Write a string left to right starting at (gx, gy), one character per cell.
     */
    function stampText(gx, gy, text, color, priority) {
      if (text === null || text === undefined) return;
      var str = String(text);
      var baseX = gx | 0;
      var baseY = gy | 0;
      if (baseY < 0 || baseY >= rows) return;

      for (var i = 0; i < str.length; i++) {
        stampCell(baseX + i, baseY, str.charAt(i), color, priority);
      }
    }

    /**
     * Flush the grid to the canvas. Clears with background colour and draws characters,
     * switching ctx.fillStyle only when the colour actually changes.
     */
    function render() {
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, cssWidth, cssHeight);
      } else {
        ctx.clearRect(0, 0, cssWidth, cssHeight);
      }

      ctx.font = fontSize + 'px ' + fontFamily;
      ctx.textBaseline = 'top';

      var padX = Math.max(0, Math.floor((cellW - fontSize * 0.6) * 0.5));
      var padY = Math.max(0, Math.floor((cellH - fontSize) * 0.5));

      var activeStyle = null;
      var total = cols * rows;

      for (var i = 0; i < total; i++) {
        if (priorities[i] === -Infinity) continue;
        var ch = chars[i];
        if (ch === ' ' || ch === '') continue;

        var c = colors[i];
        if (c !== activeStyle) {
          ctx.fillStyle = c;
          activeStyle = c;
        }

        var gx = i % cols;
        var gy = (i / cols) | 0;
        ctx.fillText(ch, gx * cellW + padX, gy * cellH + padY);
      }
    }

    /**
     * Export the current grid buffer as plain text and row arrays for static snapshots.
     */
    function toText() {
      var rowStrings = new Array(rows);
      for (var y = 0; y < rows; y++) {
        var line = '';
        var rowOffset = y * cols;
        for (var x = 0; x < cols; x++) {
          var idx = rowOffset + x;
          var ch = priorities[idx] === -Infinity ? ' ' : chars[idx];
          line += ch || ' ';
        }
        rowStrings[y] = line;
      }
      return {
        plain: rowStrings.join('\n'),
        rows: rowStrings
      };
    }

    function prefersReducedMotion() {
      return Boolean(
        global.matchMedia &&
        global.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    }

    function tick(now) {
      if (!isRunning) return;

      if (typeof document !== 'undefined' && document.hidden) {
        lastFrameTime = 0;
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (!lastFrameTime) {
        lastFrameTime = now;
      }

      var dtMs = Math.min(100, Math.max(0, now - lastFrameTime));
      lastFrameTime = now;
      elapsedTotal += dtMs;

      if (frameCallback) {
        frameCallback(engine, elapsedTotal, dtMs);
      }

      if (isRunning) {
        rafId = requestAnimationFrame(tick);
      }
    }

    /**
     * Start the requestAnimationFrame loop.
     * - Calling start() twice does not create a second loop.
     * - If prefers-reduced-motion is active, runs callback once and does not loop.
     */
    function start(callback) {
      if (typeof callback === 'function') {
        frameCallback = callback;
      }
      if (!frameCallback) return;

      if (prefersReducedMotion()) {
        stop();
        frameCallback(engine, elapsedTotal, 0);
        return;
      }

      if (isRunning) return;
      isRunning = true;
      lastFrameTime = 0;
      rafId = requestAnimationFrame(tick);
    }

    /**
     * Stop the animation loop.
     */
    function stop() {
      isRunning = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // Debounced window resize listener and visibilitychange pause recovery
    if (typeof global.addEventListener === 'function') {
      if (opts.autoResize !== false) {
        global.addEventListener('resize', function () {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            resize();
            if (!isRunning && frameCallback) {
              frameCallback(engine, elapsedTotal, 0);
            }
          }, opts.resizeDebounceMs);
        });
      }

      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden && isRunning) {
            lastFrameTime = performance.now();
          }
        });
      }
    }

    var engine = {
      resize: resize,
      clear: clear,
      stampCell: stampCell,
      stampPx: stampPx,
      stampText: stampText,
      render: render,
      start: start,
      stop: stop,
      toText: toText,
      get cols() {
        return cols;
      },
      get rows() {
        return rows;
      }
    };

    // Initialize dimensions and allocate buffers right away
    resize();

    return engine;
  }

  // ============================================================================
  // 3. IMAGE SAMPLER (CONVERSION MODE)
  // ============================================================================

  function getSourceDimensions(source) {
    if (!source) return { width: 0, height: 0 };
    var w =
      source.naturalWidth ||
      source.videoWidth ||
      source.width ||
      (source.getBoundingClientRect ? source.getBoundingClientRect().width : 0);
    var h =
      source.naturalHeight ||
      source.videoHeight ||
      source.height ||
      (source.getBoundingClientRect ? source.getBoundingClientRect().height : 0);
    return { width: Number(w) || 0, height: Number(h) || 0 };
  }

  /**
   * Sample any CanvasImageSource (<img>, <video>, <canvas>) into an ASCII structure.
   * Pure computation: uses an offscreen canvas at output grid size, reads pixels
   * with getImageData, and computes luminance as 0.2126*R + 0.7152*G + 0.0722*B.
   */
  function fromImage(source, options) {
    var opts = Object.assign(
      {
        cols: 80,
        ramp: RAMPS.standard,
        color: true,
        invert: false,
        charAspect: 0.55
      },
      options || {}
    );

    var dims = getSourceDimensions(source);
    if (dims.width <= 0 || dims.height <= 0) {
      return { plain: '', rows: [], colors: opts.color ? [] : null };
    }

    var targetCols = Math.max(1, Math.round(Number(opts.cols) || 80));
    var charAspect = Number(opts.charAspect) || 0.55;
    var targetRows = Math.max(
      1,
      Math.round((dims.height / dims.width) * targetCols * charAspect)
    );

    var ramp =
      typeof opts.ramp === 'string' && opts.ramp.length > 0
        ? opts.ramp
        : RAMPS.standard;
    var rampLen = ramp.length;

    var offscreen = document.createElement('canvas');
    offscreen.width = targetCols;
    offscreen.height = targetRows;

    var octx = offscreen.getContext('2d', { willReadFrequently: true });
    octx.clearRect(0, 0, targetCols, targetRows);
    octx.drawImage(source, 0, 0, targetCols, targetRows);

    var imgData = octx.getImageData(0, 0, targetCols, targetRows).data;
    var outRows = new Array(targetRows);
    var outColors = opts.color ? new Array(targetRows) : null;

    for (var y = 0; y < targetRows; y++) {
      var line = '';
      var colorRow = opts.color ? new Array(targetCols) : null;

      for (var x = 0; x < targetCols; x++) {
        var offset = (y * targetCols + x) * 4;
        var r = imgData[offset];
        var g = imgData[offset + 1];
        var b = imgData[offset + 2];
        var a = imgData[offset + 3];

        // Fully transparent cells become a space
        if (a === 0) {
          line += ' ';
          if (colorRow) colorRow[x] = 'transparent';
          continue;
        }

        var lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        if (opts.invert) {
          lum = 1 - lum;
        }

        var rampIdx = Math.min(
          rampLen - 1,
          Math.max(0, Math.floor(lum * rampLen))
        );
        line += ramp.charAt(rampIdx);

        if (colorRow) {
          colorRow[x] = 'rgb(' + r + ',' + g + ',' + b + ')';
        }
      }

      outRows[y] = line;
      if (outColors) outColors[y] = colorRow;
    }

    return {
      plain: outRows.join('\n'),
      rows: outRows,
      colors: outColors
    };
  }

  /**
   * Populate a <pre> element with the result of fromImage().
   * When result.colors is present, groups consecutive matching colours into <span>s.
   */
  function renderToPre(preElement, result) {
    if (!preElement || !result) return;

    if (!result.colors) {
      preElement.textContent = result.plain || '';
      return;
    }

    preElement.textContent = '';
    var frag = document.createDocumentFragment();
    var rows = result.rows || [];
    var colors = result.colors || [];

    for (var y = 0; y < rows.length; y++) {
      var rowStr = rows[y];
      var colorRow = colors[y] || [];
      var runChars = '';
      var runColor = null;

      for (var x = 0; x < rowStr.length; x++) {
        var ch = rowStr.charAt(x);
        var col = colorRow[x] || '';

        if (col === runColor) {
          runChars += ch;
        } else {
          if (runChars.length > 0) {
            appendRun(frag, runChars, runColor);
          }
          runColor = col;
          runChars = ch;
        }
      }

      if (runChars.length > 0) {
        appendRun(frag, runChars, runColor);
      }

      if (y < rows.length - 1) {
        frag.appendChild(document.createTextNode('\n'));
      }
    }

    preElement.appendChild(frag);
  }

  function appendRun(fragment, text, color) {
    if (!color || color === 'transparent' || text.trim() === '') {
      fragment.appendChild(document.createTextNode(text));
    } else {
      var span = document.createElement('span');
      span.style.color = color;
      span.textContent = text;
      fragment.appendChild(span);
    }
  }

  // ============================================================================
  // 4. PUBLIC API EXPORT
  // ============================================================================

  global.AsciiEngine = {
    PRIORITY: PRIORITY,
    RAMPS: RAMPS,
    create: create,
    fromImage: fromImage,
    renderToPre: renderToPre
  };
})(typeof window !== 'undefined' ? window : globalThis);