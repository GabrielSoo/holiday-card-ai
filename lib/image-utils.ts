/**
 * Composites text onto an image using Canvas API
 * @param imageUrl - Base64 data URL or http URL of the base image
 * @param text - Text to overlay on the image
 * @returns Promise<string> - Base64 data URL of the composited image
 */
export async function compositeTextOnImage(
  imageUrl: string,
  text: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      try {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // 1. Draw the base image
        ctx.drawImage(img, 0, 0);

        // 2. Add a subtle gradient at the bottom to make text pop
        const gradient = ctx.createLinearGradient(0, img.height * 0.6, 0, img.height);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.6)"); // Darker at bottom
        ctx.fillStyle = gradient;
        ctx.fillRect(0, img.height * 0.6, img.width, img.height * 0.4);

        // 3. Configure text style
        // Use a font stack that handles Chinese beautifully
        const fontSize = Math.floor(img.width / 10);
        ctx.font = `bold ${fontSize}px "Noto Serif TC", "Microsoft YaHei", "PingFang TC", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // --- Text Wrapping Logic ---
        const maxWidth = img.width * 0.9; // 90% of image width
        const lineHeight = fontSize * 1.2;
        
        // Determine split strategy: if text has spaces, assume English/spaced language, otherwise assume Chinese/continuous
        const hasSpaces = text.includes(' ');
        const words = hasSpaces ? text.split(' ') : text.split('');
        
        let lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            // Add space if we're in "English mode" (hasSpaces), otherwise just append
            const separator = hasSpaces ? ' ' : '';
            const testLine = currentLine + separator + word;
            const width = ctx.measureText(testLine).width;
            
            if (width < maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);

        // Calculate starting Y position to center the text block in the bottom area
        // We want the text block center to be at y = img.height * 0.85
        const totalTextHeight = lines.length * lineHeight;
        let startY = (img.height * 0.85) - (totalTextHeight / 2) + (lineHeight / 2);

        // Safety check: Ensure the bottom of the text doesn't go off screen
        // Calculate where the last line would be drawn
        const lastLineY = startY + ((lines.length - 1) * lineHeight);
        // If last line is below 90% of image height, shift everything up
        const maxY = img.height * 0.90;
        if (lastLineY > maxY) {
            startY -= (lastLineY - maxY);
        }

        // Draw each line
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            const x = canvas.width / 2;

            // Glow/Shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
            ctx.shadowBlur = 15;
            ctx.lineWidth = fontSize / 15;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
            ctx.strokeText(line, x, y);

            // Text Fill
            ctx.fillStyle = "#FFFFFF"; 
            
            ctx.fillText(line, x, y);
        });

        // Convert to data URL
        const compositedImage = canvas.toDataURL("image/png", 1.0);
        resolve(compositedImage);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}