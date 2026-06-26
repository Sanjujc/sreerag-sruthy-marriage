// --- Soft Flow Cursor Physics ---
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const trail = document.querySelector('.cursor-trail');
const dot = document.querySelector('.cursor-dot');
const ambientBg = document.querySelector('.ambient-bg');

const state = {
    mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    scroll: window.scrollY || 0
};

const lerp = (start, end, factor) => start + (end - start) * factor;
let smoothMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        state.mouse.x = e.clientX;
        state.mouse.y = e.clientY;
        
        if (trail) {
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;
        }
    });

    const render = () => {
        try {
            smoothMouse.x = lerp(smoothMouse.x, state.mouse.x, 0.1);
            smoothMouse.y = lerp(smoothMouse.y, state.mouse.y, 0.1);

            if (dot) {
                dot.style.left = `${smoothMouse.x}px`;
                dot.style.top = `${smoothMouse.y}px`;
            }

            // Parallax movement of ambient background
            const xOffset = (smoothMouse.x / window.innerWidth) - 0.5;
            const yOffset = (smoothMouse.y / window.innerHeight) - 0.5;
            if (ambientBg) {
                ambientBg.style.transform = `translate(${xOffset * -20}px, calc(${state.scroll * 0.2}px + ${yOffset * -20}px))`;
            }
        } catch (e) {
            console.error("Render loop error", e);
        }

        requestAnimationFrame(render);
    };
    render();
}

// Magnetic Interactions for interactive elements
function bindInteractives() {
    const interactives = document.querySelectorAll('.magnetic-item, .event-card, button, a');
    if (!isTouchDevice) {
        interactives.forEach(el => {
            if (el.dataset.bound) return;
            el.dataset.bound = "true";

            el.addEventListener('mouseenter', () => {
                if (dot) {
                    dot.style.transform = 'translate(-50%, -50%) scale(1.6)';
                    dot.style.borderColor = 'rgba(232, 200, 156, 0.6)';
                    dot.style.background = 'radial-gradient(circle, rgba(232, 200, 156, 0.2) 0%, transparent 70%)';
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (dot) {
                    dot.style.transform = 'translate(-50%, -50%) scale(1)';
                    dot.style.borderColor = 'rgba(232, 200, 156, 0.15)';
                    dot.style.background = 'radial-gradient(circle, rgba(232, 200, 156, 0.12) 0%, transparent 70%)';
                }
            });
        });
    }
}

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    state.scroll = window.scrollY;
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Hide scroll indicator on scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 150) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.8';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }
});

// Staggered Scroll-Trigger Fades
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.10 };
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
bindInteractives();

// Monitor dynamically added nodes (for Web Components)
const mutationObserver = new MutationObserver((mutations) => {
    let shouldBind = false;
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                if (node.classList && node.classList.contains('fade-up')) {
                    observer.observe(node);
                }
                const fadeUps = node.querySelectorAll('.fade-up');
                if (fadeUps) {
                    fadeUps.forEach(el => observer.observe(el));
                }
                shouldBind = true;
            }
        });
    });
    if (shouldBind) bindInteractives();
});
mutationObserver.observe(document.body, { childList: true, subtree: true });

// --- Background Music Controls ---
const audioToggle = document.getElementById('audioToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;
let isMuted = true;

const playIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
const pauseIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

const unmuteOnInteraction = () => {
    if (!bgMusic || !isMuted) return;
    bgMusic.muted = false;
    bgMusic.volume = 0;
    bgMusic.play().then(() => {
        isPlaying = true;
        isMuted = false;
        if (audioToggle) audioToggle.innerHTML = pauseIcon;
        let vol = 0;
        const fadeIn = setInterval(() => {
            vol = Math.min(vol + 0.02, 0.85);
            bgMusic.volume = vol;
            if (vol >= 0.85) clearInterval(fadeIn);
        }, 100);
    }).catch(e => console.log("Autoplay blocked by browser", e));

    document.removeEventListener('click', unmuteOnInteraction);
    document.removeEventListener('touchstart', unmuteOnInteraction);
};

// --- Door Opening Unveil Logic ---
const introOverlay = document.getElementById('introOverlay');
const enterBtn = document.getElementById('enterBtn');

if (enterBtn && introOverlay) {
    enterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Unmute and play background music
        unmuteOnInteraction();
        
        // Trigger parting doors animation
        introOverlay.classList.add('unveiled');
        
        // Trigger content visibility transitions after opening begins
        setTimeout(() => {
            document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
        }, 500);

        // Remove overlay panel from DOM structure after slide ends
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 1800);
    });
} else {
    // Fallback listeners for user interactions if overlay isn't present
    document.addEventListener('click', unmuteOnInteraction);
    document.addEventListener('touchstart', unmuteOnInteraction);
    
    // Force visibility on hero immediately as fallback
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
    }, 500);
}

if (audioToggle) {
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMuted) {
            unmuteOnInteraction();
        } else if (isPlaying) {
            bgMusic.pause();
            audioToggle.innerHTML = playIcon;
            isPlaying = false;
        } else {
            bgMusic.play();
            audioToggle.innerHTML = pauseIcon;
            isPlaying = true;
        }
    });
}

// --- Celestial Constellation Star Engine ---
const canvas = document.getElementById('constellationCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];
    const maxDistance = 110; // Max distance to draw connections

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    class Star {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.depth = Math.random(); 
            this.size = this.depth * 4.6 + 1.0; // Larger gold particles
            this.speedY = -(this.depth * 0.35 + 0.08); // Rising drift speed
            this.speedX = (Math.random() - 0.5) * 0.15;
            
            this.baseOpacity = this.depth * 0.52 + 0.28; // Brighter gold base
            this.opacity = this.baseOpacity;
            this.pulseSpeed = 0.015 + Math.random() * 0.02;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.type = Math.random() < 0.45 ? 'heart' : 'star'; // More love symbols
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            // Twinkling effect
            this.pulsePhase += this.pulseSpeed;
            this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.25;
            
            // Wrap around edges
            if (this.y < -20) {
                this.y = height + 20;
                this.x = Math.random() * width;
            }
            if (this.x < -20) this.x = width + 20;
            if (this.x > width + 20) this.x = -20;
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(223, 177, 91, ${Math.max(0, Math.min(this.opacity, 0.98))})`;
            ctx.shadowBlur = this.size * 4.8; // Stronger gold glow shadow
            ctx.shadowColor = '#dfb15b';
            
            if (this.type === 'heart') {
                const size = this.size * 1.4 + 0.8; // Scale hearts to be smaller and more delicate
                const topY = this.y - size * 0.35;
                ctx.moveTo(this.x, topY);
                ctx.bezierCurveTo(this.x - size / 2, topY - size / 2, this.x - size, topY + size / 3, this.x, topY + size);
                ctx.bezierCurveTo(this.x + size, topY + size / 3, this.x + size / 2, topY - size / 2, this.x, topY);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Spawn 260 cosmic stars for a richer gold backdrop
    const starCount = isTouchDevice ? 120 : 260;
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }

    const animateConstellations = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Update & Draw Stars
        stars.forEach(s => {
            s.update();
            s.draw();
        });

        // Draw dynamic connection lines
        ctx.shadowBlur = 0; // Disable shadow blur for line performance
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const s1 = stars[i];
                const s2 = stars[j];
                const dx = s1.x - s2.x;
                const dy = s1.y - s2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    const alpha = (1 - (dist / maxDistance)) * 0.42; // Brighter gold connections
                    ctx.beginPath();
                    ctx.moveTo(s1.x, s1.y);
                    ctx.lineTo(s2.x, s2.y);
                    ctx.strokeStyle = `rgba(223, 177, 91, ${alpha})`;
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }

            // Connect to mouse cursor
            if (!isTouchDevice) {
                const s = stars[i];
                const dx = state.mouse.x - s.x;
                const dy = state.mouse.y - s.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDistance * 1.35) {
                    const alpha = (1 - (dist / (maxDistance * 1.35))) * 0.52; // Brighter mouse connection lines
                    ctx.beginPath();
                    ctx.moveTo(s.x, s.y);
                    ctx.lineTo(state.mouse.x, state.mouse.y);
                    ctx.strokeStyle = `rgba(223, 177, 91, ${alpha})`;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animateConstellations);
    };
    animateConstellations();
}

// --- Calendar Event Integrator ---
function setupCalendarBtn(btnId, eventDetails) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const { title, location, details, startDate, endDate } = eventDetails;
            const isAppleDevice = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
            
            if (isAppleDevice) {
                const icsContent = 
"BEGIN:VCALENDAR\n" +
"VERSION:2.0\n" +
"BEGIN:VEVENT\n" +
"DTSTART:" + startDate + "\n" +
"DTEND:" + endDate + "\n" +
"SUMMARY:" + title + "\n" +
"DESCRIPTION:" + details + "\n" +
"LOCATION:" + location + "\n" +
"END:VEVENT\n" +
"END:VCALENDAR";

                const uri = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);
                window.location.href = uri;
            } else {
                const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
                window.open(googleUrl, '_blank');
            }
        });
    }
}

// Thursday, 27 August 2026. Thalikettu at 10.00 AM (IST)
setupCalendarBtn('saveThalikettuBtn', {
    title: "Sreerag & Sruthy - Thalikettu Ceremony",
    location: "Attukal Bhagavathy Temple, Thiruvananthapuram, Kerala 695009",
    details: "Thalikettu Ceremony (10.00 AM) and Sweekaranam Muhurtham (10.45 AM - 11.30 AM). Please join us to bless the couple!",
    startDate: "20260827T043000Z", // 10:00 AM IST (4:30 AM UTC)
    endDate: "20260827T060000Z"   // 11:30 AM IST (6:00 AM UTC)
});

// Thursday, 27 August 2026. Reception/Celebration at Mount Carmel Center
setupCalendarBtn('saveReceptionBtn', {
    title: "Sreerag & Sruthy - Wedding Reception",
    location: "Mount Carmel Convention Center, Vazhuthacaud, Thiruvananthapuram, Kerala 695014",
    details: "Join us for the wedding celebration and lunch feast at Mount Carmel Convention Center.",
    startDate: "20260827T051500Z", // 10:45 AM IST (5:15 AM UTC)
    endDate: "20260827T093000Z"   // 3:00 PM IST (9:30 AM UTC)
});
