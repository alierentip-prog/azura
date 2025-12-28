/** * AZURA: THE BLACKOUT - PRO RENDERER
 * Güncellenmiş render-engine.js
 */
AzuraEngine.renderer = {
    canvas: null, ctx: null,
    init(id) { this.canvas = document.getElementById(id); this.ctx = this.canvas.getContext('2d'); this.resize(); },
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; },

    render() {
        const { ctx, canvas } = this;
        const { player, settings } = AzuraEngine.state;
        const { world } = AzuraEngine;

        // 1. Zemin ve Tavan (Karanlık Atmosfer)
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Raycasting
        const numRays = canvas.width / settings.res;
        for (let i = 0; i < numRays; i++) {
            let rayAngle = (player.dir - settings.fov / 2) + (i / numRays) * settings.fov;
            let dist = 0; let hit = 0;

            while (dist < 12) {
                dist += 0.05;
                let rx = player.x + Math.cos(rayAngle) * dist;
                let ry = player.y + Math.sin(rayAngle) * dist;
                hit = world.getTile(rx, ry);
                if (hit > 0) break;
            }

            dist *= Math.cos(rayAngle - player.dir);
            let h = canvas.height / (dist + 0.1);

            // GÖRSEL ŞÖLEN: Mesafeye göre kararma ve Renk Modları
            let color = [34, 211, 238]; // Standart Neon Cyan
            if (hit === 2) color = [244, 63, 94]; // Ölüm Kırmızısı
            if (hit === 4) color = [16, 185, 129]; // Bitiş Yeşili

            // Mesafe Sınırı (Karanlıkta Kaybolma Efekti)
            let opacity = Math.max(0, 1 - dist / 8); 
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
            
            // Duvarlara "Barkod/Matrix" deseni ekleme
            ctx.fillRect(i * settings.res, (canvas.height - h) / 2, settings.res, h);
            
            // Üst ve alt kenarlara parlama (Glow)
            ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity * 0.3})`;
            ctx.fillRect(i * settings.res, (canvas.height - h) / 2 - 2, settings.res, 2);
            ctx.fillRect(i * settings.res, (canvas.height + h) / 2, settings.res, 2);
        }

        // 3. VIGNETTE (Kenar Karartması - Odak Noktası Yaratır)
        let grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/0.8);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'black');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,canvas.width, canvas.height);
    }
};
