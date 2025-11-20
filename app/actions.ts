// src/app/actions.ts
import { amplifyClient } from "@/app/amplify-utils";

/**
 * Maps background selections to detailed prompt descriptions
 */
function getBackgroundDescription(background: string): string {
  const backgroundMap: Record<string, string> = {
    "hong-kong": "The Hong Kong skyline should be clearly visible and prominent in the background, wide panoramic view, recognizable IFC, ICC, and Bank of China Tower silhouettes, Victoria Harbour visible, occupying the upper half of the scene, not obscured by the foreground, iconic Hong Kong cityscape",
    "london": "The London skyline featuring Big Ben, the London Eye, and Tower Bridge should be clearly visible and prominent in the background, wide panoramic view across the Thames River, recognizable iconic landmarks, occupying the upper half of the scene, not obscured by the foreground, classic British architecture",
    "village": "A charming Christmas village scene with snow-covered cottages, church steeple, cobblestone streets lined with decorated shops, warm glowing windows, street lamps with wreaths, snow-covered rooftops with chimneys emitting smoke, wide panoramic village view in the background, festive and cozy atmosphere"
  };

  return backgroundMap[background] || background;
}

/**
 * Maps style selections to detailed artistic style descriptions
 */
function getStyleDescription(style: string): string {
  const styleMap: Record<string, string> = {
    "吉布利": "A whimsical Studio Ghibli-style illustration with warm watercolor textures, soft shading, cozy festive atmosphere, gentle falling snow.",
    "寫實": "Photorealistic style, highly detailed, natural lighting, realistic textures and shadows, professional photography quality, crisp details, lifelike rendering",
    "素描": "Pencil sketch style, hand-drawn illustration, visible sketch lines, artistic shading with cross-hatching, black and white with subtle grey tones, artistic and expressive"
  };

  return styleMap[style] || style;
}


export async function generateHolidayCard(formData: FormData) {
  const background = formData.get("background")?.toString() || "";
  const style = formData.get("style")?.toString() || "";
  const image = formData.get("image")?.toString() || "";

   // Get detailed descriptions
   const backgroundDescription = getBackgroundDescription(background);
   const styleDescription = getStyleDescription(style);

   // Build the full prompt text (same as in bedrock.js)
   const fullPrompt = `Create a illustration with the following specifications:
- Background setting: ${backgroundDescription}
- Artistic style: ${styleDescription}
- High Quality, Highly detailed background environment.`;

  const response = await amplifyClient.queries.askBedrock({
    background: backgroundDescription,
    style: styleDescription,
    image,
  });

  const rawBody = response.data?.body;
  console.log("Bedrock raw response body:", rawBody);
  if (!rawBody) {
    return { image: "", prompt: fullPrompt };
  }

  let res: any;
  try {
    res = JSON.parse(rawBody);
  } catch {
    console.log("Bedrock response is not valid JSON, returning raw body");
    return { image: rawBody, prompt: fullPrompt };
  }

  console.log("Bedrock parsed response object:", res);

 // Nova Canvas returns base64 encoded images in the response
 const imageData = res?.images?.[0] ?? "";
  
 if (imageData) {
   // Return as data URL for direct display in an <img> tag along with the prompt
   return {
     image: `data:image/png;base64,${imageData}`,
     prompt: fullPrompt
   };
 }

 console.log("No image generated");
 return { image: "", prompt: fullPrompt };
}