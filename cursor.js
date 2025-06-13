document.addEventListener('DOMContentLoaded', function() {
    // Configuración del efecto
    const config = {
        trailLength: 20,
        trailDelay: 25,
        trailColor: 'rgba(21, 86, 133, 0.7)',
        trailWidth: 4,
        fadeDuration: 600,
        clickableElements: 'a, button, [role="button"], [onclick], [href], label, input, select, textarea, .clickable, .btn',
        hoverScale: 1.5,
        hoverColor: 'rgba(255, 165, 0, 0.8)',
        clickEffectDuration: 300,
        clickEffectColor: 'rgba(255, 255, 255, 0.9)'
    };

    // Crear elementos del cursor
    const trailCanvas = document.createElement('canvas');
    trailCanvas.id = 'cursorTrail';
    trailCanvas.style.position = 'fixed';
    trailCanvas.style.top = '0';
    trailCanvas.style.left = '0';
    trailCanvas.style.pointerEvents = 'none';
    trailCanvas.style.zIndex = '9999';
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
    document.body.appendChild(trailCanvas);
    
    const ctx = trailCanvas.getContext('2d');
    let mouseX = 0, mouseY = 0;
    let trailPoints = [];
    let lastTimestamp = 0;
    let isOverClickable = false;
    let clickEffectTime = 0;

    // Cursor personalizado
    const customCursor = document.createElement('div');
    customCursor.id = 'customCursor';
    customCursor.style.position = 'fixed';
    customCursor.style.width = '12px';
    customCursor.style.height = '12px';
    customCursor.style.backgroundColor = '#ffffff';
    customCursor.style.borderRadius = '50%';
    customCursor.style.pointerEvents = 'none';
    customCursor.style.zIndex = '10000';
    customCursor.style.transform = 'translate(-50%, -50%)';
    customCursor.style.mixBlendMode = 'difference';
    customCursor.style.transition = 'transform 0.15s ease, width 0.15s ease, height 0.15s ease';
    document.body.appendChild(customCursor);

    // Actualizar tamaño del canvas al redimensionar
    window.addEventListener('resize', function() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    });

    // Detectar elementos clickeables
    function isClickable(element) {
        if (element.matches(config.clickableElements)) return true;
        
        // Comprobar si el elemento tiene un manejador de eventos de click
        if (typeof element.onclick === 'function') return true;
        
        // Comprobar estilos (cursor: pointer)
        const style = window.getComputedStyle(element);
        if (style.cursor === 'pointer') return true;
        
        return false;
    }

    // Seguir la posición del mouse
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Detectar si está sobre un elemento clickeable
        const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
        const newIsOverClickable = elementUnderMouse ? isClickable(elementUnderMouse) : false;
        
        if (newIsOverClickable !== isOverClickable) {
            isOverClickable = newIsOverClickable;
            updateCursorAppearance();
        }

        // Registrar punto del trazo
        const now = Date.now();
        if (now - lastTimestamp > config.trailDelay) {
            trailPoints.push({
                x: mouseX, 
                y: mouseY, 
                time: now,
                isClickable: isOverClickable
            });
            lastTimestamp = now;
            
            if (trailPoints.length > config.trailLength) {
                trailPoints.shift();
            }
        }
    });

    // Actualizar apariencia del cursor
    function updateCursorAppearance() {
        if (isOverClickable) {
            customCursor.style.width = '16px';
            customCursor.style.height = '16px';
            customCursor.style.backgroundColor = config.hoverColor;
        } else {
            customCursor.style.width = '12px';
            customCursor.style.height = '12px';
            customCursor.style.backgroundColor = '#ffffff';
        }
    }

    // Efecto al hacer click
    document.addEventListener('mousedown', function() {
        clickEffectTime = Date.now();
        customCursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });

    document.addEventListener('mouseup', function() {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Función de animación
    function animateTrail() {
        ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        const now = Date.now();
        
        // Dibujar trazo
        for (let i = 0; i < trailPoints.length; i++) {
            const point = trailPoints[i];
            const age = now - point.time;
            const opacity = Math.max(0, 1 - (age / config.fadeDuration));
            
            if (opacity > 0) {
                // Color del punto (depende si está sobre clickable)
                let color = point.isClickable ? config.hoverColor : config.trailColor;
                color = color.replace(/[\d.]+\)$/, opacity.toFixed(2) + ')');
                
                // Dibujar punto
                ctx.beginPath();
                ctx.arc(point.x, point.y, config.trailWidth, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
                
                // Conectar con el siguiente punto
                if (i < trailPoints.length - 1) {
                    const nextPoint = trailPoints[i + 1];
                    const nextAge = now - nextPoint.time;
                    const nextOpacity = Math.max(0, 1 - (nextAge / config.fadeDuration));
                    
                    if (nextOpacity > 0) {
                        let lineColor = nextPoint.isClickable ? config.hoverColor : config.trailColor;
                        lineColor = lineColor.replace(/[\d.]+\)$/, Math.min(opacity, nextOpacity).toFixed(2) + ')');
                        
                        ctx.beginPath();
                        ctx.moveTo(point.x, point.y);
                        ctx.lineTo(nextPoint.x, nextPoint.y);
                        ctx.lineWidth = config.trailWidth;
                        ctx.strokeStyle = lineColor;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Efecto de click
        if (clickEffectTime > 0) {
            const clickAge = now - clickEffectTime;
            if (clickAge < config.clickEffectDuration) {
                const clickOpacity = 1 - (clickAge / config.clickEffectDuration);
                const radius = config.trailWidth * 3 * (clickAge / config.clickEffectDuration);
                
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
                ctx.fillStyle = config.clickEffectColor.replace(/[\d.]+\)$/, clickOpacity.toFixed(2) + ')');
                ctx.fill();
            } else {
                clickEffectTime = 0;
            }
        }
        
        // Actualizar posición del cursor
        customCursor.style.left = mouseX + 'px';
        customCursor.style.top = mouseY + 'px';
        
        // Eliminar puntos antiguos
        trailPoints = trailPoints.filter(p => now - p.time < config.fadeDuration);
        
        requestAnimationFrame(animateTrail);
    }

    // Ocultar cursor original
    document.body.style.cursor = 'none';

    // Iniciar animación
    animateTrail();
});