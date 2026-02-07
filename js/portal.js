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
  let resizeHandler = null;

  // ============================================
  // WORMHOLE CANVAS — Swirling Vortex + Nebula
  // ============================================
  function initWormhole(canvas) {
    const ctx = canvas.getContext('2d');
    const container = canvas.closest('.portal-circle');
    let w = canvas.width = container ? container.offsetWidth : 520;
    let h = canvas.height = container ? container.offsetHeight : 520;
    const cx = () => w / 2;
    const cy = () => h / 2;
    let t = 0;

    // Stars with depth
    const stars = [];
    const STAR_COUNT = 300;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * w * 0.5 + 20,
        z: Math.random() * w,
        speed: 0.002 + Math.random() * 0.008,
        size: 0.5 + Math.random() * 2,
        hue: 140 + Math.random() * 80 // green → cyan range
      });
    }

    // Nebula particles
    const nebulae = [];
    const NEBULA_COUNT = 40;
    for (let i = 0; i < NEBULA_COUNT; i++) {
      nebulae.push({
        angle: Math.random() * Math.PI * 2,
        radius: 30 + Math.random() * w * 0.4,
        speed: 0.001 + Math.random() * 0.004,
        size: 20 + Math.random() * 60,
        hue: [160, 200, 270, 300, 140][Math.floor(Math.random() * 5)],
        alpha: 0.02 + Math.random() * 0.06
      });
    }

    // Energy tendrils
    const tendrils = [];
    const TENDRIL_COUNT = 6;
    for (let i = 0; i < TENDRIL_COUNT; i++) {
      tendrils.push({
        baseAngle: (i / TENDRIL_COUNT) * Math.PI * 2,
        segments: 30 + Math.floor(Math.random() * 20),
        speed: 0.3 + Math.random() * 0.5,
        width: 1 + Math.random() * 2,
        hue: 150 + Math.random() * 60
      });
    }

    function resizeCanvas() {
      if (container) {
        w = canvas.width = container.offsetWidth;
        h = canvas.height = container.offsetHeight;
      }
    }
    // Remove any previous resize listener
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
    resizeHandler = resizeCanvas;
    window.addEventListener('resize', resizeHandler);

    function draw() {
      t += 0.016;

      // Dark fade with slight trail
      ctx.fillStyle = 'rgba(3, 3, 8, 0.15)';
      ctx.fillRect(0, 0, w, h);

      const centerX = cx();
      const centerY = cy();
      const maxR = Math.min(w, h) * 0.48;

      // --- NEBULA CLOUDS ---
      ctx.globalCompositeOperation = 'screen';
      for (const n of nebulae) {
        n.angle += n.speed;
        const r = n.radius + Math.sin(t * 0.5 + n.angle * 3) * 15;
        const x = centerX + Math.cos(n.angle) * r;
        const y = centerY + Math.sin(n.angle) * r;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, n.size);
        grad.addColorStop(0, `hsla(${n.hue}, 80%, 50%, ${n.alpha * 1.5})`);
        grad.addColorStop(0.5, `hsla(${n.hue}, 70%, 40%, ${n.alpha * 0.5})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(x - n.size, y - n.size, n.size * 2, n.size * 2);
      }

      // --- SPIRAL VORTEX ARMS ---
      ctx.globalCompositeOperation = 'lighter';
      const armCount = 5;
      for (let arm = 0; arm < armCount; arm++) {
        const armOffset = (arm / armCount) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i < 200; i++) {
          const frac = i / 200;
          const spiralAngle = armOffset + frac * Math.PI * 4 + t * 0.5;
          const spiralR = frac * maxR;
          const wobble = Math.sin(frac * 20 + t * 2) * (2 + frac * 8);
          const x = centerX + Math.cos(spiralAngle) * (spiralR + wobble);
          const y = centerY + Math.sin(spiralAngle) * (spiralR + wobble);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const hue = 160 + arm * 25;
        ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${0.08 + Math.sin(t + arm) * 0.03})`;
        ctx.lineWidth = 1.5 + Math.sin(t * 0.7 + arm) * 0.5;
        ctx.stroke();
      }

      // --- ENERGY TENDRILS (electric arcs) ---
      for (const tendril of tendrils) {
        const baseA = tendril.baseAngle + t * 0.2;
        ctx.beginPath();
        let prevX = centerX;
        let prevY = centerY;

        for (let s = 0; s < tendril.segments; s++) {
          const frac = s / tendril.segments;
          const r = frac * maxR * 0.9;
          const jitter = (Math.random() - 0.5) * (8 + frac * 20);
          const angle = baseA + frac * 0.8 + Math.sin(t * tendril.speed + s * 0.3) * 0.3;
          const x = centerX + Math.cos(angle) * r + jitter;
          const y = centerY + Math.sin(angle) * r + jitter;

          if (s === 0) ctx.moveTo(x, y);
          else {
            ctx.quadraticCurveTo(prevX + jitter * 0.3, prevY + jitter * 0.3, x, y);
          }
          prevX = x;
          prevY = y;
        }

        const alpha = 0.15 + Math.random() * 0.2;
        ctx.strokeStyle = `hsla(${tendril.hue}, 100%, 70%, ${alpha})`;
        ctx.lineWidth = tendril.width;
        ctx.shadowColor = `hsla(${tendril.hue}, 100%, 60%, 0.5)`;
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // --- STARS (spiral motion toward center) ---
      ctx.globalCompositeOperation = 'lighter';
      for (const star of stars) {
        star.angle += star.speed;
        star.z -= 1.5;

        if (star.z <= 0) {
          star.z = w * 0.5;
          star.radius = Math.random() * w * 0.5 + 20;
          star.angle = Math.random() * Math.PI * 2;
        }

        const depthScale = (1 - star.z / (w * 0.5));
        const r = star.radius * (star.z / (w * 0.5));
        const x = centerX + Math.cos(star.angle) * r;
        const y = centerY + Math.sin(star.angle) * r;

        const size = star.size * depthScale;
        const alpha = Math.max(0, depthScale * 0.8);

        // Star trail
        const trailAngle = star.angle - star.speed * 3;
        const trailR = star.radius * ((star.z + 4) / (w * 0.5));
        const tx = centerX + Math.cos(trailAngle) * trailR;
        const ty = centerY + Math.sin(trailAngle) * trailR;

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `hsla(${star.hue}, 85%, 75%, ${alpha * 0.5})`;
        ctx.lineWidth = size * 0.6;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 90%, 85%, ${alpha})`;
        ctx.fill();
      }

      // --- CENTER CORE GLOW ---
      ctx.globalCompositeOperation = 'screen';
      const pulse = 1 + Math.sin(t * 2) * 0.2;
      const coreSize = 60 * pulse;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize * 2);
      outerGlow.addColorStop(0, `hsla(165, 90%, 60%, ${0.15 * pulse})`);
      outerGlow.addColorStop(0.3, `hsla(175, 80%, 50%, ${0.06 * pulse})`);
      outerGlow.addColorStop(0.6, `hsla(200, 70%, 40%, ${0.02})`);
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, w, h);

      // Inner bright core
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize * 0.5);
      coreGrad.addColorStop(0, `hsla(160, 100%, 90%, ${0.4 * pulse})`);
      coreGrad.addColorStop(0.3, `hsla(160, 90%, 70%, ${0.2 * pulse})`);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // --- PULSING RINGS ---
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.8 + i * 1.2) % 5;
        const ringR = (phase / 5) * maxR;
        const ringAlpha = (1 - phase / 5) * 0.12;

        ctx.beginPath();
        ctx.arc(centerX, centerY, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(165, 80%, 60%, ${ringAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      portalAnimationId = requestAnimationFrame(draw);
    }

    ctx.fillStyle = 'rgb(3, 3, 8)';
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

  // Fluid simulation is handled by js/fluid.js (FluidSimulation global)

  // ============================================
  // PORTAL OPEN / CLOSE
  // ============================================
  if (portalTrigger && portalExpanded) {
    const lang = localStorage.getItem('preferredLanguage') || 'es';
    portalTrigger.setAttribute('data-tooltip', lang === 'en' ? 'Parallel dimension' : 'Dimensión paralela');

    portalTrigger.addEventListener('click', () => {
      // Force animation restart by removing/re-adding active class
      portalExpanded.classList.remove('active');
      void portalExpanded.offsetHeight; // Force reflow
      portalExpanded.classList.add('active');
      document.body.classList.add('portal-open');
      document.body.style.overflow = 'hidden';
      if (portalCanvas) {
        if (stopWormhole) {
          stopWormhole();
          stopWormhole = null;
        }
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

          // Start WebGL fluid simulation
          if (dimensionBg) {
            dimensionBg.width = window.innerWidth;
            dimensionBg.height = window.innerHeight;
            try { FluidSimulation.start(dimensionBg); } catch(e) { console.warn('Fluid simulation failed:', e); }
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
        document.body.classList.remove('zen-mode');

        try { FluidSimulation.stop(); } catch(e) {}

        window.scrollTo({ top: 0, behavior: 'auto' });
      });
    }

    // ============================================
    // ZEN MODE (hide UI, fluid canvas only)
    // ============================================
    const dimensionZen = document.getElementById('dimensionZen');
    if (dimensionZen) {
      dimensionZen.addEventListener('click', () => {
        document.body.classList.toggle('zen-mode');
      });
    }
  }
})();
