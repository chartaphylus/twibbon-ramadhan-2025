document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('card-canvas');
    const ctx = canvas.getContext('2d');
    const nameInput = document.getElementById('name-input');
    const downloadBtn = document.getElementById('download-btn');

    // Configuration
    const config = {
        templateSrc: 'assets/twibbon.png',
        canvasWidth: 1080,
        canvasHeight: 1920, // Vertical Story/Status format
        fontFamily: "'Outfit', 'Madani', 'Tajawal', 'Cairo', sans-serif",
        baseFontSize: 80,
        textColor: '#dbc26fec', // Gold color to match design
        textYPercent: 0.82,
        textShadow: false
    };

    // State
    const templateImage = new Image();
    let isTemplateLoaded = false;

    // Initialize Canvas
    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    // Load Template
    templateImage.onload = () => {
        isTemplateLoaded = true;
        // Update canvas to match image dimensions exactly to prevent stretching
        canvas.width = templateImage.naturalWidth;
        canvas.height = templateImage.naturalHeight;
        drawCanvas();
    };

    templateImage.onerror = () => {
        console.warn('Template image not found. Using fallback generator.');
        // Still draw the fallback
        drawCanvas();
    };

    templateImage.src = config.templateSrc;

    // Event Listeners
    nameInput.addEventListener('input', drawCanvas);

    // Draw Function
    function drawCanvas() {
        // 1. Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Background/Template
        if (isTemplateLoaded) {
            ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
        } else {
            drawFallbackTemplate();
        }

        // 3. Draw Text
        const name = nameInput.value.trim();
        if (name) {
            drawName(name);
        }
    }

    function drawName(text) {
        ctx.save();

        // Font Settings
        // Dynamic sizing: Scale down if text is too long
        const scaleFactor = canvas.width / 1080; // normalized to 1080p
        let fontSize = config.baseFontSize * scaleFactor;
        ctx.font = `bold ${fontSize}px ${config.fontFamily}`;

        const maxWidth = canvas.width * 0.8; // 80% of canvas width
        let textWidth = ctx.measureText(text).width;

        // Decrease font size until it fits
        while (textWidth > maxWidth && fontSize > (30 * scaleFactor)) {
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px ${config.fontFamily}`;
            textWidth = ctx.measureText(text).width;
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const x = canvas.width / 2;
        const y = canvas.height * config.textYPercent;

        // Shadow for better visibility
        if (config.textShadow) {
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        ctx.fillStyle = config.textColor;
        ctx.fillText(text, x, y);

        // Optional: Draw a line under or above if needed (decorative)
        // ctx.fillRect(x - textWidth/2, y + fontSize/2 + 20, textWidth, 5);

        ctx.restore();
    }

    function drawFallbackTemplate() {
        // Create a nice placeholder card if image is missing
        const w = canvas.width;
        const h = canvas.height;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f0f4f8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Border
        ctx.strokeStyle = '#D4AF37'; // Gold
        ctx.lineWidth = 40;
        ctx.strokeRect(20, 20, w - 40, h - 40);

        // Inner Border
        ctx.lineWidth = 5;
        ctx.strokeRect(50, 50, w - 100, h - 100);

        // Decorative Circle
        ctx.fillStyle = '#1e3a65'; // Blue
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.3, 150, 0, Math.PI * 2);
        ctx.fill();

        // Placeholder Text for "Ramadhan"
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 120px "Amiri", serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ramadhan', w / 2, h * 0.3);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px "Amiri", serif';
        ctx.fillText('1448 H', w / 2, h * 0.3 + 80);

        // Footer Text
        ctx.fillStyle = '#888';
        ctx.font = '40px sans-serif';
        ctx.fillText('Template Image Not Found', w / 2, h - 100);
        ctx.font = '30px sans-serif';
        ctx.fillText('Please place "template_card.png" in assets folder', w / 2, h - 60);
    }

    // Download Handler
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        const name = nameInput.value.trim() || 'Ramadhan-Card';
        link.download = `Kartu-Ucapan-${name.replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // Initial Draw
    nameInput.value = "";
    drawCanvas();
});
