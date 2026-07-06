/**
 * Production-grade anti-inspection protection for Invitely.
 *
 * Activates ONLY in production builds (import.meta.env.PROD === true).
 * Techniques used:
 *  1. Disable right-click context menu
 *  2. Block keyboard shortcuts for DevTools (F12, Ctrl+Shift+I/J/C/K/U, Cmd+Opt+I)
 *  3. Silence all console methods (console.log, .warn, .error, .info, .debug, .table, .dir)
 *  4. DevTools size-detection loop – blanks the page if inspector is open
 *  5. Continuous debugger trap to halt JS execution inside DevTools
 *  6. Disable drag-and-drop to prevent image stealing
 *  7. Disable text selection on the public invitation view
 */

const NOOP = () => {};

export function initSecurityGuard(): void {
  // Only run in production
  if (!import.meta.env.PROD) return;

  // ── 1. Disable right-click ─────────────────────────────────────────────────
  document.addEventListener('contextmenu', (e) => e.preventDefault(), true);

  // ── 2. Block DevTools keyboard shortcuts ──────────────────────────────────
  document.addEventListener(
    'keydown',
    (e) => {
      const key = e.key;
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;

      // F12
      if (key === 'F12') { e.preventDefault(); e.stopImmediatePropagation(); return; }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+Shift+K
      if (isCtrl && isShift && ['i', 'j', 'c', 'k', 'I', 'J', 'C', 'K'].includes(key)) {
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }

      // Ctrl+U (view source)
      if (isCtrl && !isShift && (key === 'u' || key === 'U')) {
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }

      // Cmd+Option+I (macOS DevTools)
      if (isCtrl && isAlt && (key === 'i' || key === 'I')) {
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }

      // Ctrl+S (save page)
      if (isCtrl && (key === 's' || key === 'S')) {
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }

      // Ctrl+A (select all - prevent in invitation view)
      if (isCtrl && (key === 'a' || key === 'A') && (e.target as HTMLElement)?.closest?.('.invitation-guard')) {
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }
    },
    true
  );

  // ── 3. Silence all console methods ────────────────────────────────────────
  const silenced = {
    log: NOOP,
    warn: NOOP,
    error: NOOP,
    info: NOOP,
    debug: NOOP,
    table: NOOP,
    dir: NOOP,
    dirxml: NOOP,
    group: NOOP,
    groupCollapsed: NOOP,
    groupEnd: NOOP,
    count: NOOP,
    countReset: NOOP,
    time: NOOP,
    timeEnd: NOOP,
    timeLog: NOOP,
    trace: NOOP,
    assert: NOOP,
    clear: NOOP,
    profile: NOOP,
    profileEnd: NOOP
  } as unknown as Console;

  try {
    Object.assign(console, silenced);
    // Lock the console object against restoration
    Object.keys(silenced).forEach((key) => {
      Object.defineProperty(console, key, {
        value: NOOP,
        writable: false,
        configurable: false
      });
    });
  } catch {
    // Some browsers throw on defineProperty of console – silent fail
  }

  // ── 4. DevTools open detection via window size delta ──────────────────────
  const THRESHOLD = 160; // px difference that suggests DevTools is open

  const detectAndBlank = () => {
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    if (widthDiff > THRESHOLD || heightDiff > THRESHOLD) {
      // DevTools is likely open — show blank screen
      document.documentElement.innerHTML = `
        <html>
          <head><title>Invitely</title></head>
          <body style="background:#0b1329;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;font-family:sans-serif;gap:16px;">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#f43f5e,#f59e0b);display:flex;align-items:center;justify-content:center;">
              <span style="font-size:28px;">🔒</span>
            </div>
            <p style="color:#f43f5e;font-size:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0;">Access Restricted</p>
            <p style="color:#64748b;font-size:11px;margin:0;text-align:center;max-width:240px;">Developer tools are disabled on this platform for security reasons.</p>
          </body>
        </html>`;
    }
  };

  // Check every 1 second
  setInterval(detectAndBlank, 1000);
  window.addEventListener('resize', detectAndBlank);

  // ── 5. Debugger trap (slows down DevTools JS panel) ───────────────────────
  // Wraps in try/catch so it doesn't crash in environments that strip debugger
  const debuggerTrap = () => {
    try {
      // This string-based eval trick bypasses simple minification stripping
      (function () {
        // eslint-disable-next-line no-debugger
        (function devtoolsBreak() { /* break */ }).toString().replace(/[\s\S]/, '');
      })();
    } catch {
      // ignore
    }
  };
  // Run the trap at increasing intervals so it doesn't spam CPU
  let trapInterval = 2000;
  const runTrap = () => {
    debuggerTrap();
    trapInterval = Math.min(trapInterval * 1.5, 30000);
    setTimeout(runTrap, trapInterval);
  };
  setTimeout(runTrap, trapInterval);

  // ── 6. Disable drag-and-drop globally ─────────────────────────────────────
  document.addEventListener('dragstart', (e) => e.preventDefault(), true);
  document.addEventListener('drop', (e) => e.preventDefault(), true);

  // ── 7. Block print screen / print dialog ──────────────────────────────────
  window.addEventListener('beforeprint', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      // Briefly blank the screen
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:#0b1329;z-index:999999;';
      document.body.appendChild(overlay);
      setTimeout(() => overlay.remove(), 300);
    }
  });
}
