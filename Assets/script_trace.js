document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.trace img').forEach(img => {
        const loupe = document.createElement('span');
        loupe.textContent = '🔍';
        loupe.className = 'zoom-icon';
        img.parentElement.style.position = 'relative';
        loupe.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.5em;
            background: rgba(0,0,0,0.5);
            color: white;
            padding: 4px;
            border-radius: 4px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        img.parentElement.appendChild(loupe);
        img.addEventListener('mouseenter', () => loupe.style.opacity = 1);
        img.addEventListener('mouseleave', () => loupe.style.opacity = 0);

        img.addEventListener('click', () => {
            const container = document.createElement('div');
            container.className = 'zoom-container';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.9);
                overflow: hidden;
                z-index: 9999;
            `;

            const imgWrapper = document.createElement('div');
            imgWrapper.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: auto;
                display: flex;
                justify-content: center;
                align-items: flex-start; // Changé à flex-start pour garder le haut visible
                padding: 20px;
                box-sizing: border-box;
            `;

            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            fullImg.style.cssText = `
                max-width: none;
                max-height: none;
                transform-origin: top center; // Optimisé pour les images hautes
                transition: transform 0.2s ease-out;
                cursor: move;
                display: block;
            `;

            let currentScale = 1;
            let isDragging = false;
            let startX, startY, scrollLeft, scrollTop;
            let initialScale = 1;

            const handleResize = () => {
                updateScale(false);
            };
            window.addEventListener('resize', handleResize);
            
            const closeZoom = () => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                    document.body.removeChild(controls);
                    document.removeEventListener('keydown', handleKey);
                    window.removeEventListener('resize', handleResize);
                }
            };

            const handleKey = (e) => {
                if (e.key === 'Escape') closeZoom();
            };
            document.addEventListener('keydown', handleKey);

            const centerImage = () => {
                const imgRect = fullImg.getBoundingClientRect();
                const wrapperRect = imgWrapper.getBoundingClientRect();
                
                // Centre horizontalement mais garde le haut visible verticalement
                const centerX = (imgRect.width - wrapperRect.width) / 2;
                imgWrapper.scrollLeft = centerX;
                
                // Pour le mode "fit to screen", on scroll légèrement vers le haut
                if (currentScale <= initialScale) {
                    imgWrapper.scrollTop = 0;
                }
            };

            const updateScale = (animate = true) => {
                if (animate) {
                    fullImg.style.transition = 'transform 0.2s ease-out';
                } else {
                    fullImg.style.transition = 'none';
                }
                
                fullImg.style.transform = `scale(${currentScale})`;
                centerImage();
            };

            // Gestion améliorée du drag
            fullImg.addEventListener('mousedown', (e) => {
                if (currentScale > 1) {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    scrollLeft = imgWrapper.scrollLeft;
                    scrollTop = imgWrapper.scrollTop;
                    fullImg.style.cursor = 'grabbing';
                    e.preventDefault();
                }
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                imgWrapper.scrollLeft = scrollLeft - dx;
                imgWrapper.scrollTop = scrollTop - dy;
                e.preventDefault();
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                fullImg.style.cursor = currentScale > 1 ? 'grab' : 'default';
            });

            fullImg.onload = () => {
                const screenW = window.innerWidth - 40;
                const screenH = window.innerHeight - 40;
                const imgW = fullImg.naturalWidth;
                const imgH = fullImg.naturalHeight;

                if (imgW > screenW || imgH > screenH) {
                    const scaleW = screenW / imgW;
                    const scaleH = screenH / imgH;
                    initialScale = currentScale = Math.min(scaleW, scaleH);
                }

                updateScale(false);
            };

            const controls = document.createElement('div');
            controls.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                display: flex;
                gap: 10px;
                z-index: 10000;
            `;

            const makeBtn = (label, action) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                btn.style.cssText = `
                    padding: 8px 12px;
                    font-size: 14px;
                    cursor: pointer;
                    border: none;
                    border-radius: 5px;
                    background: #fff;
                    font-weight: bold;
                `;
                btn.onclick = action;
                return btn;
            };

            controls.appendChild(makeBtn('+', () => {
                if (currentScale < 10) {
                    currentScale = Math.min(10, currentScale + 0.5);
                    updateScale();
                    fullImg.style.cursor = 'grab';
                }
            }));

            controls.appendChild(makeBtn('–', () => {
                if (currentScale > 0.1) {
                    currentScale = Math.max(0.1, currentScale - 0.5);
                    updateScale();
                    fullImg.style.cursor = currentScale > 1 ? 'grab' : 'default';
                }
            }));

            controls.appendChild(makeBtn('Réinitialiser', () => {
                currentScale = initialScale;
                updateScale();
                fullImg.style.cursor = 'default';
            }));

            controls.appendChild(makeBtn('Fermer', closeZoom));

            // Fermeture au clic sur le fond - version corrigée
            container.addEventListener('click', (e) => {
                if (e.target === container && !isDragging) {
                    closeZoom();
                }
            });

            imgWrapper.appendChild(fullImg);
            container.appendChild(imgWrapper);
            document.body.appendChild(container);
            document.body.appendChild(controls);
        });
    });
});