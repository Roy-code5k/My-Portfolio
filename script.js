document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            cursorOutline.animate({
                left: `${mouseX}px`,
                top: `${mouseY}px`
            }, { duration: 500, fill: "forwards" });
        });
    }

    // 2. Staggered Animation for Tiles (Reveal w/ fallback)
    const tiles = document.querySelectorAll('.bento-tile');
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        setTimeout(() => {
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });

    // 3. Interactive Fluid Gradient Animation
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Orb {
            constructor(color) {
                this.radius = (Math.random() * 150) + 200; // Extra large for liquid feel
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                // Base velocity
                this.dx = (Math.random() - 0.5) * 1.5;
                this.dy = (Math.random() - 0.5) * 1.5;
                this.color = color;

                // For organic pulse
                this.baseRadius = this.radius;
                this.angle = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.02;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }

            update() {
                // Organic movement (pulse size)
                this.angle += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.angle) * 20;

                // Mouse Interaction (Liquid Repulsion)
                // Calculate distance to mouse
                const dxMouse = mouseX - this.x;
                const dyMouse = mouseY - this.y;
                const distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                const interactionRadius = 400;

                if (distance < interactionRadius) {
                    // Move away from mouse
                    const forceDirectionX = dxMouse / distance;
                    const forceDirectionY = dyMouse / distance;
                    const force = (interactionRadius - distance) / interactionRadius;
                    const directionX = forceDirectionX * force * 3; // Push strength
                    const directionY = forceDirectionY * force * 3;

                    this.x -= directionX;
                    this.y -= directionY;
                }

                // Bounce off walls
                if (this.x + this.radius > canvas.width) this.dx = -Math.abs(this.dx);
                if (this.x - this.radius < 0) this.dx = Math.abs(this.dx);
                if (this.y + this.radius > canvas.height) this.dy = -Math.abs(this.dy);
                if (this.y - this.radius < 0) this.dy = Math.abs(this.dy);

                // Constant ambient movement
                this.x += this.dx;
                this.y += this.dy;

                this.draw();
            }
        }

        let orbs = [];
        function init() {
            orbs = [];
            // Create theme-colored liquid blobs
            orbs.push(new Orb('#FF2E63')); // Pink
            orbs.push(new Orb('#FF9F1C')); // Orange
            orbs.push(new Orb('#FF2E63')); // Pink
            orbs.push(new Orb('#FF9F1C')); // Orange
            orbs.push(new Orb('#6C1BF9')); // Deep Purple accent for depth
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Screen blend mode for glowing look
            ctx.globalCompositeOperation = 'screen';

            for (let i = 0; i < orbs.length; i++) {
                orbs[i].update();
            }

            ctx.globalCompositeOperation = 'source-over';
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        init();
        animate();
    }
});
