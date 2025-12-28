/** * AZURA: QUANTUM BREACH - PHYSICS & LOOP
 * Part 4: Collision Detection & Main Loop
 */

AzuraEngine.physics = {
    update() {
        const { state, world } = AzuraEngine;
        if (!state.isRunning) return;

        // 1. Dönüş Hesaplama
        state.player.dir += state.player.r;

        // 2. Hareket ve Çarpışma Hesaplama (Collision Detection)
        // Oyuncunun bir sonraki potansiyel adımı
        let newX = state.player.x + Math.cos(state.player.dir) * state.player.v;
        let newY = state.player.y + Math.sin(state.player.dir) * state.player.v;

        // Çarpışma Testi
        const checkResult = world.checkCollision(newX, newY);

        if (checkResult === 'PATH') {
            // Yol temiz, ilerle
            state.player.x = newX;
            state.player.y = newY;
        } else if (checkResult === 'DEATH') {
            // Kırmızı duvara çarptı: RESET
            this.handleDeath();
        } else if (checkResult === 'WIN') {
            // Yeşil kapıya ulaştı: VICTORY
            this.handleWin();
        } else {
            // Duvara çarptı (WALL): Dur, ama kayma efekti için sürtünme uygula
            state.player.v *= 0.5;
        }

        // 3. Sürtünme ve Yavaşlama (Daha pürüzsüz duruş için)
        if (!state.touch.active) {
            state.player.v *= 0.85;
            state.player.r *= 0.85;
        }
    },

    handleDeath() {
        AzuraEngine.state.isRunning = false;
        AzuraEngine.log("CRITICAL ERROR: NEURAL BREACH DETECTED", "danger");
        
        // Ölüm flaşı efekti (UI partında tetiklenecek)
        const flash = document.getElementById('death-flash');
        if(flash) {
            flash.style.display = 'block';
            setTimeout(() => {
                flash.style.display = 'none';
                // Başlangıç noktasına ışınla
                AzuraEngine.state.player.x = 2.0;
                AzuraEngine.state.player.y = 2.0;
                AzuraEngine.state.player.dir = 0;
                AzuraEngine.state.isRunning = true;
            }, 150);
        }
    },

    handleWin() {
        AzuraEngine.state.isRunning = false;
        AzuraEngine.log("SUCCESS: DATA CORE SYNCHRONIZED", "success");
        alert("TEBRİKLER! Azura Kuantum Veri Çekirdeğine Ulaştınız.");
        location.reload(); // Şimdilik ana menüye döner
    }
};

// ANA DÖNGÜ (Saniyede 60 Kare)
AzuraEngine.mainLoop = function() {
    AzuraEngine.physics.update();
    AzuraEngine.renderer.render();
    
    if (AzuraEngine.state.isRunning) {
        requestAnimationFrame(AzuraEngine.mainLoop);
    }
};
