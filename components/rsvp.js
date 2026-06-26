class RsvpForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .rsvp-section { padding: 8rem 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .rsvp-title { font-family: var(--font-heading); font-size: 2.8rem; font-weight: 300; color: var(--text-color); margin-bottom: 0.5rem; letter-spacing: 2px; text-transform: uppercase;}
                .rsvp-subtitle { margin-bottom: 4.5rem; color: var(--accent-color); letter-spacing: 4px; text-transform: uppercase; font-size: 0.75rem; }
                
                .rsvp-container {
                    display: flex; flex-direction: column; gap: 2.5rem; width: 100%; max-width: 580px;
                    padding: 6.5rem 3.5rem 4.5rem 3.5rem; background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border); border-radius: 180px 180px 24px 24px; box-shadow: var(--glass-shadow);
                    position: relative;
                }

                .rsvp-container::after {
                    content: '';
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    right: 10px;
                    bottom: 10px;
                    border: 1px dashed rgba(229, 196, 151, 0.12);
                    border-radius: 172px 172px 16px 16px;
                    pointer-events: none;
                }
                
                .input-group { display: flex; flex-direction: column; width: 100%; }
                .input-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 3px; color: var(--text-muted); margin-bottom: 0.6rem; text-align: left;}
                
                .rsvp-input {
                    width: 100%; padding: 0.6rem 0; border: 0; border-bottom: 1px solid var(--glass-border);
                    background: transparent; color: var(--text-color); font-family: var(--font-body); font-size: 1.05rem;
                    outline: none; transition: border-color 0.4s; border-radius: 0;
                }
                .rsvp-input:focus { border-color: var(--accent-color); }
                .rsvp-input::placeholder { color: var(--text-muted); opacity: 0.35; }
                
                select.rsvp-input { cursor: pointer; appearance: none; -webkit-appearance: none; }
                select.rsvp-input option { background: var(--bg-color); color: var(--text-color); }

                .rsvp-btn {
                    margin-top: 1rem;
                    padding: 1.1rem; border-radius: 40px; background: transparent; color: var(--accent-color);
                    border: 1px solid var(--glass-border); font-family: var(--font-body); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px;
                    cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); width: 100%; text-align: center;
                }
                .rsvp-btn:hover { background: var(--accent-color); color: var(--bg-color); border-color: var(--accent-color); box-shadow: 0 0 15px rgba(229, 196, 151, 0.35); }
                
                @media (max-width: 768px) {
                    .rsvp-container { border-radius: 140px 140px 16px 16px; padding: 5rem 2rem 3.5rem 2rem; }
                    .rsvp-container::after { border-radius: 132px 132px 10px 10px; }
                    .rsvp-input { font-size: 1rem; }
                    .rsvp-btn { padding: 1rem; font-size: 0.85rem; font-weight: 500; }
                }
            </style>
            <section id="rsvp" class="rsvp-section fade-up">
                <h2 class="rsvp-title">Your Presence</h2>
                <p class="rsvp-subtitle">Kindly Reply By August 15th</p>
                <form class="rsvp-container">
                    
                    <div class="input-group">
                        <label class="input-label">Your Name</label>
                        <input type="text" id="wa-name" class="rsvp-input magnetic-item" placeholder="First & Last Name" required>
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label">Will You Attend?</label>
                        <select id="wa-guests" class="rsvp-input magnetic-item" required>
                            <option value="1">Attending Solo</option>
                            <option value="2">Bringing a Guest</option>
                            <option value="0">Will Celebrate from Afar</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label class="input-label">Send RSVP To</label>
                        <select id="wa-contact" class="rsvp-input magnetic-item" required>
                            <option value="919895883145">Somasekharan Nair (Bride's Father)</option>
                            <option value="919895887481">Rajalekshmi R (Bride's Mother)</option>
                        </select>
                    </div>
 
                    <button type="submit" class="rsvp-btn magnetic-item">Confirm RSVP</button>
                    
                </form>
            </section>
        `;

        const form = this.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = this.querySelector('#wa-name').value.trim();
            const guestsEl = this.querySelector('#wa-guests');
            const attendance = guestsEl.options[guestsEl.selectedIndex].text;
            const phoneNumber = this.querySelector('#wa-contact').value;

            // Constructing an elegant WhatsApp template message
            const rawMessage = `✨ *Wedding RSVP* ✨\n\n*Name:* ${name}\n*Status:* ${attendance}\n\nLooking forward to celebrating with Sreerag & Reshma (Sruthy)!`;

            // URL encode to safely pass through web
            const encodedMessage = encodeURIComponent(rawMessage);

            // Open native WhatsApp API window
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        });
    }
}
customElements.define('rsvp-form', RsvpForm);
