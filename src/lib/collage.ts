export async function generateCollage(photoDataUrls: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
        console.log("Generating collage...");
        const template = new Image();
        template.src = "/template.png";
        template.crossOrigin = "anonymous";

        template.onerror = (e) => {
            console.error("Failed to load template image. Check public/template.png", e);
            reject("Template load failed: Image not found or access denied.");
        };

        template.onload = async () => {
            console.log("Template loaded successfully");
            const canvas = document.createElement("canvas");
            canvas.width = template.width;
            canvas.height = template.height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject("Could not get canvas context");
                return;
            }

            // 1. Draw Photos FIRST (Background)
            // Precise coordinates from Figma:
            // Box 3: X=1250, Y=531, W=527, H=349
            // Gap: 27px
            // Calculated Box 2: X=696
            // Calculated Box 1: X=142
            const photoConfig = [
                { x: 142, y: 531, w: 527, h: 349 },  // Left
                { x: 696, y: 531, w: 527, h: 349 },  // Center
                { x: 1250, y: 531, w: 527, h: 349 }  // Right
            ];

            // Load all photos
            const loadedPhotos = await Promise.all(photoDataUrls.map(url => {
                return new Promise<HTMLImageElement>((res) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => res(img);
                });
            }));

            // Draw Photos
            loadedPhotos.forEach((img, i) => {
                if (i >= photoConfig.length) return;
                const cfg = photoConfig[i];

                // Smart Crop / Cover Logic
                // We want to fill the cfg rectangle.

                // Save context for clipping to the slot area
                ctx.save();
                ctx.beginPath();
                ctx.rect(cfg.x, cfg.y, cfg.w, cfg.h);
                ctx.clip();

                // Calculate cover dimensions
                const imgRatio = img.width / img.height;
                const targetRatio = cfg.w / cfg.h;
                let renderW, renderH, renderX, renderY;

                if (imgRatio > targetRatio) {
                    // Image is wider than slot -> Fit Height, Crop Width
                    renderH = cfg.h;
                    renderW = cfg.h * imgRatio;
                    renderX = cfg.x - (renderW - cfg.w) / 2;
                    renderY = cfg.y;
                } else {
                    // Image is taller/narrower -> Fit Width, Crop Height
                    renderW = cfg.w;
                    renderH = cfg.w / imgRatio;
                    renderX = cfg.x;
                    renderY = cfg.y - (renderH - cfg.h) / 2;
                }

                ctx.drawImage(img, renderX, renderY, renderW, renderH);
                ctx.restore();
            });

            // 2. Draw Template ON TOP (Foreground)
            ctx.drawImage(template, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };
    });
}
