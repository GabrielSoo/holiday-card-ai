export function request(ctx) {
  const { background, style, image } = ctx.args;

  const promptText = `Create a illustration with the following specifications:
- Background setting: ${background}
- Artistic style: ${style}
- High Quality, Highly detailed background environment.`;

  const seed = Math.floor(Math.random() * 858993460);

  // Strip data URL prefix if present (e.g., "data:image/jpeg;base64,")
  let base64Image = image || "";
  if (base64Image.includes(",")) {
    base64Image = base64Image.split(",")[1];
  }

  const requestBody = {
    taskType: "TEXT_IMAGE",   
    textToImageParams: {
      text: promptText,
      negativeText: "blurry, low quality, distorted, ugly, text, words, watermark, messy background, obscured background, incomplete background",
      conditionImage: base64Image,  
      controlMode: "CANNY_EDGE", 
      controlStrength: 0.4,   
    },
    imageGenerationConfig: {
      width: 672,
      height: 1024,
      cfgScale: 7.5,
      quality: "standard",
      seed,
      numberOfImages: 1,
    },
  };

  return {
    resourcePath: `/model/amazon.nova-canvas-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    },
  };
}

export function response(ctx) {
  return {
    body: ctx.result.body,
  };
}