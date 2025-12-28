/** * AZURA: QUANTUM BREACH - CORE ENGINE v1.0
 * Part 1: Input & State Management
 */

const AzuraEngine = {
    state: {
        isRunning: false,
        stage: 1,
        score: 0,
        player: {
            x: 2.0, y: 2.0, dir: 0, 
            v: 0, r: 0, health: 100,
            weaponReady: true
        },
        settings: {
            fov: Math.PI / 3,
            res: window.innerWidth < 768 ? 4 : 2, // Mobil performans ayarı
            renderDist: 14
        },
        touch: {
            active: false,
            startX: 0, startY: 0,
            curX: 0, curY: 0,
            vectorX: 0, vectorY: 0
        }
    },

    // Mobil Joystick ve Dokunmatik İşleyici
    initControls() {
        const handleTouch = (e, type) => {
            const t = e.touches[0];
            if (type === 'start') {
                this.state.touch.active = true;
                this.state.touch.startX = t.clientX;
                this.state.touch.startY = t.clientY;
                this.log("Neural Link: Established");
            } else if (type === 'move') {
                this.state.touch.curX = t.clientX;
                this.state.touch.curY = t.clientY;
                
                // Vektör Hesaplama
                let dx = this.state.touch.curX - this.state.touch.startX;
                let dy = this.state.touch.curY - this.state.touch.startY;
                let dist = Math.min(Math.sqrt(dx*dx + dy*dy), 60);
                let angle = Math.atan2(dy, dx);

                // Oyuncu Hareketine Aktar
                this.state.player.v = -Math.sin(angle) * (dist / 60) * 0.12;
                this.state.player.r = Math.cos(angle) * (dist / 60) * 0.06;
                
                // Görsel joystick güncelleme (UI katmanı için)
                this.updateJoystickUI(Math.cos(angle)*dist, Math.sin(angle)*dist);
            } else {
                this.state.touch.active = false;
                this.state.player.v = 0;
                this.state.player.r = 0;
                this.updateJoystickUI(0, 0);
            }
        };

        window.addEventListener('touchstart', e => handleTouch(e, 'start'), {passive: false});
        window.addEventListener('touchmove', e => handleTouch(e, 'move'), {passive: false});
        window.addEventListener('touchend', e => handleTouch(e, 'end'), {passive: false});
    },

    updateJoystickUI(x, y) {
        const stick = document.getElementById('stick');
        if(stick) stick.style.transform = `translate(${x}px, ${y}px)`;
    },

    log(msg) {
        const logs = document.getElementById('logs');
        if(logs) {
            const entry = document.createElement('div');
            entry.innerHTML = `> <span style="color:#22d3ee">${new Date().toLocaleTimeString()}</span>: ${msg}`;
            logs.prepend(entry);
            if(logs.children.length > 5) logs.removeChild(logs.lastChild);
        }
    }
};
          
