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

        // Text positioning (lower third looks more like a caption/card greeting)
        const x = canvas.width / 2;
        const y = canvas.height * 0.85;

        // 4. Add a glow/outline effect
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 15;
        ctx.lineWidth = fontSize / 15;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"; // Subtle stroke
        ctx.strokeText(text, x, y);

        // 5. Draw the main text
        // Option A: Classic White
        ctx.fillStyle = "#FFFFFF"; 
        
        ctx.fillText(text, x, y);

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