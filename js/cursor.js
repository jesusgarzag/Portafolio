document.addEventListener('DOMContentLoaded', function () {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!hasFinePointer) return;

  // ---- Config ----
  const LERP_GLOW = 0.35;
  const LERP_BLOB = 0.15;

  // ---- Glow canvas — soft ambient light following cursor ----
  const glowCanvas = document.createElement('canvas');
  glowCanvas.id = 'cursorGlow';
  document.body.appendChild(glowCanvas);
  const gCtx = glowCanvas.getContext('2d');

  function resizeGlow() {
    glowCanvas.width = window.innerWidth;
    glowCanvas.height = window.innerHeight;
  }
  resizeGlow();
  window.addEventListener('resize', resizeGlow);

  // ---- Blob cursor element ----
  const blobCursor = document.getElementById('blobCursor');

  // ---- State ----
  let mx = -400, my = -400;
  let gx = -400, gy = -400;
  let bx = -400, by = -400;
  let hidden = true;
  let velocity = 0;
  let prevMx = 0, prevMy = 0;

  // ---- Events ----
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;

    velocity = Math.min(Math.hypot(mx - prevMx, my - prevMy), 80);
    prevMx = mx;
    prevMy = my;

    if (hidden) {
      hidden = false;
      glowCanvas.style.opacity = '1';
    }
  });

  document.addEventListener('mouseleave', function () {
    hidden = true;
    glowCanvas.style.opacity = '0';
  });

  // ---- Blob hover detection ----
  document.addEventListener('mouseover', function (e) {
    if (!blobCursor) return;
    const target = e.target.closest('a, button, input, textarea, [role="button"]');
    if (target) {
      blobCursor.classList.add('hover');
    } else {
      blobCursor.classList.remove('hover');
    }
  });

  // ---- Draw ----
  function tick() {
    const isDimensionMode = document.body.classList.contains('dimension-mode');

    // Glow canvas (only in normal mode)
    if (!isDimensionMode) {
      gx += (mx - gx) * LERP_GLOW;
      gy += (my - gy) * LERP_GLOW;

      const w = glowCanvas.width;
      const h = glowCanvas.height;
      gCtx.clearRect(0, 0, w, h);

      if (!hidden) {
        const isLight = document.body.classList.contains('light');
        const baseAlpha = isLight ? 0.03 : 0.05;
        const velBoost = velocity * 0.0003;
        const alpha = Math.min(baseAlpha + velBoost, 0.09);
        const radius = 600;

        const g1 = gCtx.createRadialGradient(gx, gy, 0, gx, gy, radius);
        g1.addColorStop(0, `rgba(16, 185, 129, ${alpha})`);
        g1.addColorStop(0.25, `rgba(16, 185, 129, ${alpha * 0.55})`);
        g1.addColorStop(0.5, `rgba(16, 185, 129, ${alpha * 0.2})`);
        g1.addColorStop(0.75, `rgba(16, 185, 129, ${alpha * 0.06})`);
        g1.addColorStop(1, 'transparent');
        gCtx.fillStyle = g1;
        gCtx.fillRect(0, 0, w, h);

        const innerAlpha = isLight ? 0.02 : 0.035;
        const g2 = gCtx.createRadialGradient(gx, gy, 0, gx, gy, 140);
        g2.addColorStop(0, `rgba(16, 185, 129, ${innerAlpha})`);
        g2.addColorStop(0.5, `rgba(16, 185, 129, ${innerAlpha * 0.3})`);
        g2.addColorStop(1, 'transparent');
        gCtx.fillStyle = g2;
        gCtx.fillRect(0, 0, w, h);
      }
    }

    // Blob cursor (only in dimension mode)
    if (isDimensionMode && blobCursor && !hidden) {
      bx += (mx - bx) * LERP_BLOB;
      by += (my - by) * LERP_BLOB;
      blobCursor.style.left = bx + 'px';
      blobCursor.style.top = by + 'px';
    }

    requestAnimationFrame(tick);
  }

  tick();
});
