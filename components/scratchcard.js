class ScratchCard extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .scratch-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem 1.5rem 2rem;
                    position: relative;
                    z-index: 10;
                }
                .scratch-card-container {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    background: rgba(10, 15, 30, 0.65);
                    border: 1px solid var(--glass-border);
                    border-radius: 50%;
                    box-shadow: var(--glass-shadow);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    -webkit-user-select: none;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .scratch-card-container:hover {
                    border-color: rgba(223, 177, 91, 0.85);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(223, 177, 91, 0.35);
                    transform: scale(1.05);
                }
                .scratch-card-revealed {
                    text-align: center;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(223, 177, 91, 0.12) 0%, transparent 80%);
                }
                .revealed-day {
                    font-family: var(--font-body);
                    font-size: 0.65rem;
                    color: var(--accent-color);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    opacity: 0.8;
                }
                .revealed-date {
                    font-family: var(--font-heading);
                    font-size: 3.5rem;
                    color: #ffffff;
                    line-height: 1.1;
                    margin: 0.2rem 0;
                    text-shadow: 0 0 12px rgba(223, 177, 91, 0.45);
                }
                .revealed-month {
                    font-family: var(--font-body);
                    font-size: 0.65rem;
                    color: var(--text-color);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    opacity: 0.8;
                }
                .scratch-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    z-index: 2;
                    border-radius: 50%;
                    transition: opacity 0.5s ease;
                }
                .scratch-hint {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    margin-top: 1.2rem;
                    opacity: 0.8;
                    animation: pulseHint 2s infinite ease-in-out;
                }
                @keyframes pulseHint {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.9; }
                }
                @media (max-width: 768px) {
                    .scratch-section {
                        padding: 3rem 1rem 1rem 1rem;
                    }
                    .scratch-card-container {
                        width: 150px;
                        height: 150px;
                    }
                    .revealed-date { font-size: 2.8rem; }
                    .revealed-day { font-size: 0.55rem; }
                    .revealed-month { font-size: 0.55rem; }
                }
            </style>
            <div class="scratch-section fade-up">
                <div class="scratch-card-container animate-ring-pulse">
                    <div class="scratch-card-revealed">
                        <div class="revealed-day">Thursday</div>
                        <div class="revealed-date">27</div>
                        <div class="revealed-month">August 2026</div>
                    </div>
                    <canvas class="scratch-canvas" width="180" height="180"></canvas>
                </div>
                <div class="scratch-hint" id="scratchHint">Scratch card to reveal the date</div>
            </div>
        `;

        this.initScratchCard();
    }

    initScratchCard() {
        const canvas = this.querySelector('.scratch-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const container = this.querySelector('.scratch-card-container');
        const hint = this.querySelector('#scratchHint');
        
        let width = container.clientWidth;
        let height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Draw luxury circular gold cover surface
        const drawCover = () => {
            ctx.clearRect(0, 0, width, height);

            // Base border background
            ctx.fillStyle = '#0a0d1a'; // Deep Navy base
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
            ctx.fill();

            // Gold metallic gradient overlay
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#a37b32'); // Darker bronze gold
            grad.addColorStop(0.3, '#ffe8be'); // Bright light gold
            grad.addColorStop(0.5, '#dfb15b'); // Bronze
            grad.addColorStop(0.7, '#ffe8be'); // Light gold
            grad.addColorStop(1, '#8c6221'); // Deep shadow gold
            ctx.fillStyle = grad;
            
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2 - 2, 0, Math.PI * 2);
            ctx.fill();

            // Add subtle noise/sparkle texture to the gold circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2 - 2, 0, Math.PI * 2);
            ctx.clip();
            for (let i = 0; i < 400; i++) {
                const px = Math.random() * width;
                const py = Math.random() * height;
                const op = Math.random() * 0.15;
                ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
                ctx.fillRect(px, py, 1.5, 1.5);
            }
            ctx.restore();

            // Draw a subtle border inside the circle
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2 - 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash

            // Draw text on the cover
            ctx.fillStyle = '#05070e'; // Contrast text color
            ctx.font = '500 9px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.letterSpacing = '1px';
            ctx.fillText('SCRATCH', width / 2, height / 2 - 18);
            
            ctx.font = '300 13px Montserrat, sans-serif';
            ctx.fillText('✦', width / 2, height / 2);
            
            ctx.font = '500 9px Montserrat, sans-serif';
            ctx.fillText('TO REVEAL', width / 2, height / 2 + 18);
        };

        drawCover();

        // Handle resizing
        window.addEventListener('resize', () => {
            if (canvas.style.opacity === '0') return; // Don't reset if already scratched off
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;
            drawCover();
        });

        let isScratching = false;
        const brushRadius = 18;

        const getCoords = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const scratch = (x, y) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
            ctx.fill();
        };

        const checkScratchPercentage = () => {
            try {
                const imgData = ctx.getImageData(0, 0, width, height);
                const pixels = imgData.data;
                const totalPixels = pixels.length / 4;
                let clearedPixels = 0;
                
                // Sample every 4th pixel inside the circle boundaries
                for (let i = 0; i < pixels.length; i += 16) {
                    if (pixels[i + 3] === 0) { // Alpha is 0 (cleared)
                        clearedPixels++;
                    }
                }
                
                // Since the canvas is square but cover is circular, area is roughly 78.5% of canvas area.
                // We divide by (total / 4) * 0.785 to get true scratch percentage.
                const percentage = (clearedPixels / ((totalPixels / 4) * 0.785)) * 100;
                if (percentage > 35) {
                    // Fade out canvas fully
                    canvas.style.pointerEvents = 'none';
                    canvas.style.opacity = '0';
                    if (hint) {
                        hint.innerText = '✦ Save the Date ✦';
                        hint.style.animation = 'none';
                        hint.style.color = 'var(--accent-color)';
                    }
                }
            } catch (e) {
                console.error("Scratch check error", e);
            }
        };

        const startScratch = (e) => {
            isScratching = true;
            const coords = getCoords(e);
            scratch(coords.x, coords.y);
        };

        const moveScratch = (e) => {
            if (!isScratching) return;
            e.preventDefault();
            const coords = getCoords(e);
            scratch(coords.x, coords.y);
        };

        const endScratch = () => {
            if (!isScratching) return;
            isScratching = false;
            checkScratchPercentage();
        };

        // Mouse listeners
        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('mousemove', moveScratch);
        window.addEventListener('mouseup', endScratch);

        // Touch listeners
        canvas.addEventListener('touchstart', startScratch, { passive: false });
        canvas.addEventListener('touchmove', moveScratch, { passive: false });
        window.addEventListener('touchend', endScratch);
    }
}
customElements.define('scratch-card', ScratchCard);
