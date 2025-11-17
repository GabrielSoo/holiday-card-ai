export function request(ctx) {
  const { prompt, background, style, text, image } = ctx.args;

  const promptText = `Create a festive holiday card illustration with the following specifications:
- Scene: ${prompt}
- Background setting: ${background}
- Artistic style: ${style}
- The card should include the text: "${text}"
- High quality, vibrant colors, cheerful holiday atmosphere`;

  const requestBody = {
    taskType: "TEXT_IMAGE",
    textToImageParams: {
      text: promptText,
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      quality: "standard",
      height: 1024,
      width: 1024,
      cfgScale: 8.0,
      seed: Math.floor(Math.random() * 1000000),
    },
  };

  // If an image is provided (base64), we can use IMAGE_VARIATION instead
  if (image && image.length > 0) {
    requestBody.taskType = "IMAGE_VARIATION";
    requestBody.imageVariationParams = {
      text: fullPrompt,
      images: [image], // Base64 encoded image
    };
    delete requestBody.textToImageParams;
  }

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