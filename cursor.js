document.addEventListener('DOMContentLoaded', function () {
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!hasFinePointer) return;

  const config = {
    trailLength: 15,
    trailDelay: 25,
    trailColor: 'rgba(16, 185, 129, 0.5)',
    trailWidth: 3,
    fadeDuration: 500,
    clickableElements: 'a, button, [role="button"], [onclick], [href], label, input, select, textarea, .clickable, .btn',
    hoverColor: 'rgba(52, 211, 153, 0.7)',
    clickEffectDuration: 250,
    clickEffectColor: 'rgba(16, 185, 129, 0.6)'
  };

  const trailCanvas = document.createElement('canvas');
  trailCanvas.id = 'cursorTrail';
  document.body.appendChild(trailCanvas);

  const ctx = trailCanvas.getContext('2d');
  let mouseX = 0, mouseY = 0;
  let trailPoints = [];
  let lastTimestamp = 0;
  let isOverClickable = false;
  let clickEffectTime = 0;

  const customCursor = document.createElement('div');
  customCursor.id = 'customCursor';
  document.body.appendChild(customCursor);

  function resize() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function isClickable(element) {
    if (!element) return false;
    if (element.matches && element.matches(config.clickableElements)) return true;
    const style = window.getComputedStyle(element);
    return style.cursor === 'pointer';
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const nowClickable = el ? isClickable(el) : false;

    if (nowClickable !== isOverClickable) {
      isOverClickable = nowClickable;
      if (isOverClickable) {
        customCursor.style.width = '18px';
        customCursor.style.height = '18px';
        customCursor.style.opacity = '0.8';
      } else {
        customCursor.style.width = '14px';
        customCursor.style.height = '14px';
        customCursor.style.opacity = '1';
      }
    }

    const now = Date.now();
    if (now - lastTimestamp > config.trailDelay) {
      trailPoints.push({ x: mouseX, y: mouseY, time: now, hover: isOverClickable });
      lastTimestamp = now;
      if (trailPoints.length > config.trailLength) trailPoints.shift();
    }
  });

  document.addEventListener('mousedown', function () {
    clickEffectTime = Date.now();
    customCursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
  });

  document.addEventListener('mouseup', function () {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  function animate() {
    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    const now = Date.now();

    for (let i = 0; i < trailPoints.length; i++) {
      const p = trailPoints[i];
      const age = now - p.time;
      const opacity = Math.max(0, 1 - age / config.fadeDuration);
      if (opacity <= 0) continue;

      const color = p.hover ? config.hoverColor : config.trailColor;
      const c = color.replace(/[\d.]+\)$/, opacity.toFixed(2) + ')');

      ctx.beginPath();
      ctx.arc(p.x, p.y, config.trailWidth, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();

      if (i < trailPoints.length - 1) {
        const next = trailPoints[i + 1];
        const nextAge = now - next.time;
        const nextOp = Math.max(0, 1 - nextAge / config.fadeDuration);
        if (nextOp > 0) {
          const lc = (next.hover ? config.hoverColor : config.trailColor)
            .replace(/[\d.]+\)$/, Math.min(opacity, nextOp).toFixed(2) + ')');
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
          ctx.lineWidth = config.trailWidth;
          ctx.strokeStyle = lc;
          ctx.stroke();
        }
      }
    }

    if (clickEffectTime > 0) {
      const clickAge = now - clickEffectTime;
      if (clickAge < config.clickEffectDuration) {
        const co = 1 - clickAge / config.clickEffectDuration;
        const r = config.trailWidth * 3 * (clickAge / config.clickEffectDuration);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, r, 0, Math.PI * 2);
        ctx.fillStyle = config.clickEffectColor.replace(/[\d.]+\)$/, co.toFixed(2) + ')');
        ctx.fill();
      } else {
        clickEffectTime = 0;
      }
    }

    customCursor.style.left = mouseX + 'px';
    customCursor.style.top = mouseY + 'px';

    trailPoints = trailPoints.filter(p => now - p.time < config.fadeDuration);
    requestAnimationFrame(animate);
  }

  document.body.style.cursor = 'none';
  animate();
});
