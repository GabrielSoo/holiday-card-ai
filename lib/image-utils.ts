

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

        // Draw the base image
        ctx.drawImage(img, 0, 0);

        // Configure text style
        const fontSize = Math.floor(img.width / 10);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Add text shadow for readability
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        // Draw text in center (multiple times for stronger shadow)
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        
        for (let i = 0; i < 3; i++) {
          ctx.fillText(text, x, y);
        }

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