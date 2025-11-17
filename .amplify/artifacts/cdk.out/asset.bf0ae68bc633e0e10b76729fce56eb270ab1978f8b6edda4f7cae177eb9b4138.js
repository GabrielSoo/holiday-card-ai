export function request(ctx) {
  const { prompt, background, style, image } = ctx.args;

  const promptText = `Create a illustration with the following specifications:
- Scene: ${prompt}
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
    taskType: "IMAGE_VARIATION",
    imageVariationParams: {
      images: [base64Image],
      similarityStrength: 0.4,
      text: promptText,
      negativeText: "blurry, low quality, distorted, ugly, without text, watermark, messy background, obscured background, incomplete background",
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