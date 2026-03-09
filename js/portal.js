(() => {
  // ============================================
  // DIMENSIONAL GATEWAY — Portal + Transition
  // ============================================
  const portalTrigger  = document.getElementById('portalTrigger');
  const portalExpanded = document.getElementById('portalExpanded');
  const portalClose    = document.getElementById('portalClose');
  const dimTransition  = document.getElementById('dimTransition');
  const dimensionBg    = document.getElementById('dimensionBg');
  const dimensionExit  = document.getElementById('dimensionExit');

  if (!portalTrigger || !portalExpanded) return;

  // ── Open portal ──
  portalTrigger.addEventListener('click', () => {
    portalExpanded.classList.remove('active');
    void portalExpanded.offsetHeight; // force reflow for animation restart
    portalExpanded.classList.add('active');
    document.body.classList.add('portal-open');
    document.body.style.overflow = 'hidden';
  });

  function closePortal() {
    portalExpanded.classList.remove('active');
    document.body.classList.remove('portal-open');
    document.body.style.overflow = '';
  }

  portalClose?.addEventListener('click', closePortal);

  portalExpanded.addEventListener('click', e => {
    if (e.target.id === 'portalBackdrop') closePortal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && portalExpanded.classList.contains('active')) closePortal();
  });

  // ── Shared dimension entry: scanline transition then callback ──
  function enterDimension(callback) {
    closePortal();

    if (dimTransition) {
      dimTransition.classList.add('active');
    }

    // After scan + fill completes (~1s), activate dimension
    setTimeout(() => {
      callback();

      // Fade out transition overlay
      if (dimTransition) {
        dimTransition.style.transition = 'opacity 0.5s ease';
        dimTransition.style.opacity = '0';
        setTimeout(() => {
          dimTransition.classList.remove('active');
          dimTransition.style.transition = '';
          dimTransition.style.opacity = '';
        }, 500);
      }
    }, 1050);
  }

  // ── Enter Fluids Dimension ──
  document.getElementById('enterFluids')?.addEventListener('click', () => {
    enterDimension(() => {
      document.body.classList.add('dimension-mode');
      document.body.style.overflow = '';

      if (dimensionBg) {
        dimensionBg.width  = window.innerWidth;
        dimensionBg.height = window.innerHeight;
        try { FluidSimulation.start(dimensionBg); } catch (e) { console.warn('Fluid simulation failed:', e); }
      }

      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  });

  // ── Enter Tubes Dimension ──
  document.getElementById('enterTubes')?.addEventListener('click', () => {
    enterDimension(() => {
      window.location.href = 'tubes.html';
    });
  });

  // ── Exit Dimension ──
  dimensionExit?.addEventListener('click', () => {
    document.body.classList.remove('dimension-mode', 'zen-mode');
    try { FluidSimulation.stop(); } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  // ── Zen Mode (hide UI, show canvas only) ──
  document.getElementById('dimensionZen')?.addEventListener('click', () => {
    document.body.classList.toggle('zen-mode');
  });
})();
