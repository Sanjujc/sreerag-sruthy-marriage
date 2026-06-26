class CountdownTimer extends HTMLElement {
    connectedCallback() {
        this.targetDate = new Date(this.getAttribute('target-date') || '2026-08-27T10:00:00').getTime();
        this.innerHTML = `
            <style>
                .countdown-wrapper { text-align: center; padding: 5rem 2rem; position: relative; z-index: 10; }
                .countdown-grid { display: flex; justify-content: center; gap: 2.5rem; margin-top: 1rem; }
                .countdown-item { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                }
                .countdown-ring {
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(223, 177, 91, 0.35);
                    background: rgba(10, 15, 30, 0.45);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(223, 177, 91, 0.05);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .countdown-ring:hover {
                    border-color: rgba(223, 177, 91, 0.85);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(223, 177, 91, 0.35);
                    transform: scale(1.05);
                }
                .countdown-number { 
                    font-family: var(--font-heading); 
                    font-size: 2.2rem; 
                    color: var(--accent-color); 
                    font-weight: 300; 
                    text-shadow: 0 0 12px rgba(223, 177, 91, 0.45); 
                    line-height: 1;
                }
                .countdown-label { 
                    font-size: 0.65rem; 
                    text-transform: uppercase; 
                    letter-spacing: 2px; 
                    color: var(--text-muted); 
                    margin-top: 0.3rem;
                }
                @media (max-width: 768px) { 
                    .countdown-wrapper { padding: 3rem 1rem; } 
                    .countdown-grid { gap: 1.2rem; flex-wrap: wrap; } 
                    .countdown-ring { width: 85px; height: 85px; }
                    .countdown-number { font-size: 1.6rem; }
                    .countdown-label { font-size: 0.55rem; letter-spacing: 1px; }
                }
            </style>
            <section class="countdown-wrapper fade-up">
                <div class="countdown-grid">
                    <div class="countdown-item">
                        <div class="countdown-ring">
                            <div class="countdown-number" id="cd-days">00</div>
                            <div class="countdown-label">Days</div>
                        </div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-ring">
                            <div class="countdown-number" id="cd-hours">00</div>
                            <div class="countdown-label">Hours</div>
                        </div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-ring">
                            <div class="countdown-number" id="cd-mins">00</div>
                            <div class="countdown-label">Mins</div>
                        </div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-ring">
                            <div class="countdown-number" id="cd-secs">00</div>
                            <div class="countdown-label">Secs</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        this.updateInterval = setInterval(() => this.updateTimer(), 1000);
        this.updateTimer();
    }
    disconnectedCallback() { clearInterval(this.updateInterval); }
    updateTimer() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        if (distance < 0) return clearInterval(this.updateInterval);
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const dEl = this.querySelector('#cd-days'); const hEl = this.querySelector('#cd-hours');
        const mEl = this.querySelector('#cd-mins'); const sEl = this.querySelector('#cd-secs');
        if(dEl) dEl.innerText = days < 10 ? '0'+days : days;
        if(hEl) hEl.innerText = hours < 10 ? '0'+hours : hours;
        if(mEl) mEl.innerText = minutes < 10 ? '0'+minutes : minutes;
        if(sEl) sEl.innerText = seconds < 10 ? '0'+seconds : seconds;
    }
}
customElements.define('countdown-timer', CountdownTimer);
