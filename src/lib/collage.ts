// Hardcoded coordinates for now.
// TODO: Externalize or make dynamic if needed.

type LayoutType = 'horizontal' | 'vertical' | 'strip_4';

interface TemplateConfig {
    templateSrc: string;
    width: number;
    height: number;
    photos: { x: number; y: number; w: number; h: number }[];
}

// NOTE: Vertical coordinates are placeholders!
const LAYOUTS: Record<LayoutType, TemplateConfig> = {
    horizontal: {
        templateSrc: '/1x3/template_h.png',
        width: 1920, // Verify actual size if possible, otherwise rely on loaded image
        height: 1080,
        photos: [
            { x: 142, y: 531, w: 527, h: 349 },  // Left
            { x: 696, y: 531, w: 527, h: 349 },  // Center
            { x: 1250, y: 531, w: 527, h: 349 }  // Right
        ]
    },
    vertical: {
        templateSrc: '/1x3/template_v.png',
        width: 1080,
        height: 1920,
        photos: [
            // Vertical Layout Coordinates from Figma
            // X stays 531 for all (Right aligned strip)
            // W=349, H=529
            // Y positions derived from top margin 140, gap 26
            { x: 531, y: 140, w: 349, h: 529 },  // Top
            { x: 531, y: 695, w: 349, h: 529 },  // Middle (140 + 529 + 26)
            { x: 531, y: 1251, w: 349, h: 529 }  // Bottom (Explicitly 1251 from image)
        ]
    },
    strip_4: {
        templateSrc: '/1x4/1x4_default.png',
        width: 880,
        height: 2650,
        photos: [
            // Specs from user images:
            // Canvas: 880 x 2650
            // Photo: 770 x 565
            // Margins: Top 64, Sides 55 (880-770)/2 = 55
            // Gap: 47
            { x: 55, y: 64, w: 770, h: 565 },
            { x: 55, y: 64 + 565 + 47, w: 770, h: 565 },         // Y = 676
            { x: 55, y: 676 + 565 + 47, w: 770, h: 565 },        // Y = 1288
            { x: 55, y: 1288 + 565 + 47, w: 770, h: 565 }        // Y = 1900
        ]
    }
};

export async function generateCollage(photoDataUrls: string[], layout: LayoutType = 'horizontal'): Promise<string> {
    return new Promise((resolve, reject) => {
        console.log(`Generating ${layout} collage...`);

        const config = LAYOUTS[layout];
        const template = new Image();
        template.src = config.templateSrc;
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
            const photoConfig = config.photos;

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
