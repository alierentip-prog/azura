/** * AZURA: QUANTUM BREACH - RENDER ENGINE
 * Part 3: 3D Raycasting & Graphics
 */

AzuraEngine.renderer = {
    canvas: null,
    ctx: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    render() {
        const { ctx, canvas } = this;
        const { player, settings } = AzuraEngine.state;
        const { world } = AzuraEngine;

        // 1. Atmosferik Gradyan (Gökyüzü ve Yer)
        let skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#020617'); // Derin Uzay
        skyGrad.addColorStop(0.5, '#1e293b'); // Ufuk Çizgisi
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

        ctx.fillStyle = '#010409'; // Zemin
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        // 2. Işın İzleme (Raycasting)
        const numRays = canvas.width / settings.res;
        const stepAngle = settings.fov / numRays;

        for (let i = 0; i < numRays; i++) {
            let rayAngle = (player.dir - settings.fov / 2) + (i * stepAngle);
            
            let distance = 0;
            let hitType = 0;
            let hitSide = false; // Duvarın hangi yüzüne çarptı (gölgelendirme için)

            // Işın ilerleme döngüsü
            while (distance < settings.renderDist) {
                distance += 0.04;
                let testX = player.x + Math.cos(rayAngle) * distance;
                let testY = player.y + Math.sin(rayAngle) * distance;

                hitType = world.getTile(testX, testY);
                if (hitType > 0) {
                    // Duvarın hangi eksende olduğunu kontrol et (Dikey/Yatay gölge farkı)
                    if (Math.abs(testX - Math.round(testX)) > Math.abs(testY - Math.round(testY))) hitSide = true;
                    break;
                }
            }

            // Balıkgözü (Fish-eye) etkisini düzelt
            let correctedDist = distance * Math.cos(rayAngle - player.dir);
            let wallHeight = canvas.height / (correctedDist + 0.1);

            // 3. Dinamik Renklendirme ve Gölgelendirme
            let color;
            if (hitType === 1) color = [34, 211, 238]; // Cyan (Normal)
            else if (hitType === 2) color = [244, 63, 94]; // Kırmızı (Tehlike)
            else if (hitType === 4) color = [16, 185, 129]; // Yeşil (Bitiş)

            // Mesafe Karartması (Depth Fog)
            let brightness = Math.max(0.1, 1 - correctedDist / settings.renderDist);
            if (hitSide) brightness *= 0.7; // Yan yüzeyleri daha karanlık yap (derinlik hissi)

            ctx.fillStyle = `rgb(${color[0] * brightness}, ${color[1] * brightness}, ${color[2] * brightness})`;
            ctx.fillRect(i * settings.res, (canvas.height - wallHeight) / 2, settings.res, wallHeight);
        }
    }
};
