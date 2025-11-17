export function request(ctx) {
  const { prompt, background, style, image } = ctx.args;

  const promptText = `Create a festive holiday card illustration with the following specifications:
- Scene: ${prompt}
- Background setting: ${background}
- Artistic style: ${style}
- High quality, vibrant colors, cheerful holiday atmosphere`;

  const seed = Math.floor(Math.random() * 858993460);


  const requestBody = {
    taskType: "IMAGE_VARIATION",
    imageVariationParams: {
      images: [image],
      similarityStrength: 0.4,
      text: promptText,
      negativeText: "blurry, low quality, distorted, ugly, text, watermark, messy background, obscured background, incomplete background",
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