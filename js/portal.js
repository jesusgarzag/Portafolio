(() => {
  // ============================================
  // MAGIC PORTAL — Wormhole Canvas + Interactions
  // ============================================
  const portalTrigger = document.getElementById('portalTrigger');
  const portalExpanded = document.getElementById('portalExpanded');
  const portalClose = document.getElementById('portalClose');
  const portalCanvas = document.getElementById('portalCanvas');

  let portalAnimationId = null;

  // Wormhole / starfield animation on canvas (sized to circular portal)
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
      // Fade trail
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

        // Project
        const sx = (star.x / star.z) * (w / 2) + cx();
        const sy = (star.y / star.z) * (h / 2) + cy();
        const px = (star.x / star.pz) * (w / 2) + cx();
        const py = (star.y / star.pz) * (h / 2) + cy();

        // Size and brightness based on depth
        const size = Math.max(0.5, (1 - star.z / w) * 3);
        const alpha = Math.max(0, (1 - star.z / w) * 0.9);

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `hsla(${star.hue}, 80%, 70%, ${alpha})`;
        ctx.lineWidth = size;
        ctx.stroke();

        // Star glow dot
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 90%, 80%, ${alpha})`;
        ctx.fill();
      }

      // Center glow (wormhole mouth)
      const gradient = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 120);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Concentric rings
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

    // Clear canvas initially
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

  if (portalTrigger && portalExpanded) {
    const lang = localStorage.getItem('preferredLanguage') || 'es';
    portalTrigger.setAttribute('data-tooltip', lang === 'en' ? 'Explore projects' : 'Explorar proyectos');

    portalTrigger.addEventListener('click', () => {
      portalExpanded.classList.add('active');
      document.body.classList.add('portal-open');
      document.body.style.overflow = 'hidden';
      // Start wormhole animation
      if (portalCanvas && !stopWormhole) {
        stopWormhole = initWormhole(portalCanvas);
      }
    });

    function closePortal() {
      portalExpanded.classList.remove('active');
      document.body.classList.remove('portal-open');
      document.body.style.overflow = '';
      // Stop wormhole animation after transition
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
      if (e.key === 'Escape' && portalExpanded.classList.contains('active')) {
        closePortal();
      }
    });
  }
})();
