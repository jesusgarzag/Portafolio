(() => {
  // ============================================
  // DIMENSION PORTAL — Gateway + Warp Effect
  // ============================================
  const portalTrigger = document.getElementById('portalTrigger');
  const portalExpanded = document.getElementById('portalExpanded');
  const portalClose = document.getElementById('portalClose');
  const portalCanvas = document.getElementById('portalCanvas');
  const dimensionEnter = document.getElementById('dimensionEnter');
  const warpOverlay = document.getElementById('warpOverlay');
  const dimensionBg = document.getElementById('dimensionBg');
  const dimensionExit = document.getElementById('dimensionExit');

  let portalAnimationId = null;

  // ============================================
  // WORMHOLE CANVAS (same as before)
  // ============================================
  function initWormhole(canvas) {
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.portal-circle');
    let w = canvas.width = container ? container.offsetWidth : 520;
    let h = canvas.height = container ? container.offsetHeight : 520;
    const cx = () => w / 2;
    const cy = () => h / 2;

    const stars = [];
    const STAR_COUNT = 200;
    const SPEED = 6;

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * w,
        pz: 0,
        hue: 160 + Math.random() * 40
      });
    }

    function resizeCanvas() {
      if (container) {
        w = canvas.width = container.offsetWidth;
        h = canvas.height = container.offsetHeight;
      }
    }
    window.addEventListener('resize', resizeCanvas);

    function draw() {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.25)';
      ctx.fillRect(0, 0, w, h);

      for (const star of stars) {
        star.pz = star.z;
        star.z -= SPEED;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * w * 2;
          star.y = (Math.random() - 0.5) * h * 2;
          star.z = w;
          star.pz = w;
          star.hue = 160 + Math.random() * 40;
        }

        const sx = (star.x / star.z) * (w / 2) + cx();
        const sy = (star.y / star.z) * (h / 2) + cy();
        const px = (star.x / star.pz) * (w / 2) + cx();
        const py = (star.y / star.pz) * (h / 2) + cy();

        const size = Math.max(0.5, (1 - star.z / w) * 3);
        const alpha = Math.max(0, (1 - star.z / w) * 0.9);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `hsla(${star.hue}, 80%, 70%, ${alpha})`;
        ctx.lineWidth = size;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 90%, 80%, ${alpha})`;
        ctx.fill();
      }

      const gradient = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 120);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      for (let i = 1; i <= 4; i++) {
        const radius = 30 + i * 30 + Math.sin(Date.now() * 0.001 + i) * 10;
        ctx.beginPath();
        ctx.arc(cx(), cy(), radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.05 - i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      portalAnimationId = requestAnimationFrame(draw);
    }

    ctx.fillStyle = 'rgb(5, 5, 8)';
    ctx.fillRect(0, 0, w, h);
    draw();

    return () => {
      if (portalAnimationId) {
        cancelAnimationFrame(portalAnimationId);
        portalAnimationId = null;
      }
    };
  }

  let stopWormhole = null;

  // ============================================
  // INTERACTIVE RAINBOW FLUID BACKGROUND
  // Cursor paints colorful swirl trails that fade
  // ============================================
  let dimensionAnimId = null;

  function initDimensionBackground(canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      // Save current content before resize
      const imageData = ctx.getImageData(0, 0, w || 1, h || 1);
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // Restore (stretches, but better than losing everything)
      if (imageData.width > 1) {
        ctx.putImageData(imageData, 0, 0);
      }
    }
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    const resizeHandler = () => resize();
    window.addEventListener('resize', resizeHandler);

    // Start with white canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Track mouse
    let mouseX = w / 2;
    let mouseY = h / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let hue = 0;
    let isMoving = false;
    let moveTimer = null;

    function onMouseMove(e) {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => { isMoving = false; }, 100);
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isMoving = true;
        clearTimeout(moveTimer);
        moveTimer = setTimeout(() => { isMoving = false; }, 100);
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove, { passive: true });

    function draw() {
      // Slowly fade everything toward white (trails dissipate)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.008)';
      ctx.fillRect(0, 0, w, h);

      if (isMoving) {
        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const speed = Math.hypot(dx, dy);

        if (speed > 1) {
          // Advance hue based on movement
          hue = (hue + speed * 0.5) % 360;

          const radius = Math.min(120, 30 + speed * 1.5);

          // Draw multiple layered soft circles along the path
          const steps = Math.max(1, Math.floor(speed / 4));
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const px = prevMouseX + dx * t;
            const py = prevMouseY + dy * t;
            const localHue = (hue + s * 8) % 360;

            // Main color blob
            const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
            grad.addColorStop(0, `hsla(${localHue}, 80%, 80%, 0.15)`);
            grad.addColorStop(0.3, `hsla(${localHue + 30}, 70%, 85%, 0.1)`);
            grad.addColorStop(0.6, `hsla(${localHue + 60}, 60%, 90%, 0.05)`);
            grad.addColorStop(1, 'hsla(0, 0%, 100%, 0)');

            ctx.fillStyle = grad;
            ctx.fillRect(px - radius, py - radius, radius * 2, radius * 2);

            // Second layer slightly offset for swirl depth
            const offset = speed * 0.3;
            const angle = Math.atan2(dy, dx) + Math.PI / 2;
            const ox = px + Math.cos(angle) * offset;
            const oy = py + Math.sin(angle) * offset;

            const grad2 = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius * 0.7);
            grad2.addColorStop(0, `hsla(${(localHue + 120) % 360}, 75%, 82%, 0.12)`);
            grad2.addColorStop(0.5, `hsla(${(localHue + 150) % 360}, 65%, 88%, 0.06)`);
            grad2.addColorStop(1, 'hsla(0, 0%, 100%, 0)');

            ctx.fillStyle = grad2;
            ctx.fillRect(ox - radius, oy - radius, radius * 2, radius * 2);
          }
        }
      }

      dimensionAnimId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (dimensionAnimId) {
        cancelAnimationFrame(dimensionAnimId);
        dimensionAnimId = null;
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', resizeHandler);
      clearTimeout(moveTimer);
    };
  }

  let stopDimensionBg = null;

  // ============================================
  // PORTAL OPEN / CLOSE
  // ============================================
  if (portalTrigger && portalExpanded) {
    const lang = localStorage.getItem('preferredLanguage') || 'es';
    portalTrigger.setAttribute('data-tooltip', lang === 'en' ? 'Parallel dimension' : 'Dimensión paralela');

    portalTrigger.addEventListener('click', () => {
      portalExpanded.classList.add('active');
      document.body.classList.add('portal-open');
      document.body.style.overflow = 'hidden';
      if (portalCanvas && !stopWormhole) {
        stopWormhole = initWormhole(portalCanvas);
      }
    });

    function closePortal() {
      portalExpanded.classList.remove('active');
      document.body.classList.remove('portal-open');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (stopWormhole) {
          stopWormhole();
          stopWormhole = null;
        }
      }, 700);
    }

    if (portalClose) {
      portalClose.addEventListener('click', closePortal);
    }

    portalExpanded.addEventListener('click', (e) => {
      if (e.target.classList.contains('portal-backdrop')) {
        closePortal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (portalExpanded.classList.contains('active')) {
          closePortal();
        }
      }
    });

    // ============================================
    // ENTER DIMENSION (warp effect)
    // ============================================
    if (dimensionEnter) {
      dimensionEnter.addEventListener('click', () => {
        // Close the portal overlay
        portalExpanded.classList.remove('active');
        document.body.classList.remove('portal-open');

        // Start warp effect
        if (warpOverlay) {
          warpOverlay.classList.add('active');
        }

        // After warp animation, activate dimension mode
        setTimeout(() => {
          if (stopWormhole) {
            stopWormhole();
            stopWormhole = null;
          }

          document.body.classList.add('dimension-mode');
          document.body.style.overflow = '';

          // Start colorful background
          if (dimensionBg && !stopDimensionBg) {
            stopDimensionBg = initDimensionBackground(dimensionBg);
          }

          // Fade out warp overlay
          if (warpOverlay) {
            warpOverlay.style.transition = 'opacity 0.6s ease';
            warpOverlay.style.opacity = '0';
            setTimeout(() => {
              warpOverlay.classList.remove('active');
              warpOverlay.style.transition = '';
              warpOverlay.style.opacity = '';
            }, 600);
          }

          window.scrollTo({ top: 0, behavior: 'auto' });
        }, 1200);
      });
    }

    // ============================================
    // EXIT DIMENSION
    // ============================================
    if (dimensionExit) {
      dimensionExit.addEventListener('click', () => {
        document.body.classList.remove('dimension-mode');

        if (stopDimensionBg) {
          stopDimensionBg();
          stopDimensionBg = null;
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    }
  }
})();
