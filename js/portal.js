(() => {
  // ============================================
  // DIMENSION PORTAL — Gateway + Warp Effect
  // ============================================
  const portalTrigger = document.getElementById('portalTrigger');
  const portalExpanded = document.getElementById('portalExpanded');
  const portalClose = document.getElementById('portalClose');
  const warpOverlay = document.getElementById('warpOverlay');
  const dimensionBg = document.getElementById('dimensionBg');
  const dimensionExit = document.getElementById('dimensionExit');

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
    });

    function closePortal() {
      portalExpanded.classList.remove('active');
      document.body.classList.remove('portal-open');
      document.body.style.overflow = '';
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
    // ENTER FLUIDS DIMENSION (warp effect)
    // ============================================
    const enterFluids = document.getElementById('enterFluids');
    if (enterFluids) {
      enterFluids.addEventListener('click', () => {
        // Close the portal overlay
        portalExpanded.classList.remove('active');
        document.body.classList.remove('portal-open');

        // Start warp effect
        if (warpOverlay) {
          warpOverlay.classList.add('active');
        }

        // After warp animation, activate fluids dimension mode
        setTimeout(() => {
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
    // ENTER TUBES DIMENSION
    // ============================================
    const enterTubes = document.getElementById('enterTubes');
    if (enterTubes) {
      enterTubes.addEventListener('click', () => {
        // Close the portal overlay
        portalExpanded.classList.remove('active');
        document.body.classList.remove('portal-open');
        document.body.style.overflow = '';

        // Start warp effect
        if (warpOverlay) {
          warpOverlay.classList.add('active');
        }

        // After warp animation, navigate to tubes dimension
        setTimeout(() => {
          window.location.href = 'tubes.html';
        }, 1200);
      });
    }

    // ============================================
    // WORLD NAME DISPLAY (SM64 course name hover)
    // ============================================
    const worldNameText = document.querySelector('.world-name-text');
    if (worldNameText) {
      document.querySelectorAll('.world-star--active').forEach(star => {
        const label = star.querySelector('.star-label');
        star.addEventListener('mouseenter', () => {
          if (label) worldNameText.textContent = label.textContent;
        });
        star.addEventListener('mouseleave', () => {
          worldNameText.innerHTML = '&nbsp;';
        });
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
