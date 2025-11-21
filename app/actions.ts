// src/app/actions.ts
import { amplifyClient } from "@/app/amplify-utils";

/**
 * Maps background selections to detailed prompt descriptions
 */
function getBackgroundDescription(background: string): string {
  const backgroundMap: Record<string, string> = {
    "harbour": "Hong Kong Victoria Harbour, wide panoramic composition, featuring the silhouettes of IFC, ICC, and Bank of China Tower clearly readable. The skyline and harbour occupy the upper half of the scene with rich hand-painted detail, atmospheric perspective, drifting clouds, warm light glowing on the harbour water",
    "peak": "Hong Kong’s iconic Victoria Peak, wide elevated view, lush green mountainside with terraced trees and sloping paths, featuring the Peak Tram ascending at a visible angle in the midground. Include historic red tram carriage with small glowing windows and soft reflected light. The scene should show the elevated view overlooking the harbour and city far below with subtle lights, atmospheric perspective, drifting clouds, and warm golden evening tones.",
    "city": "A wide Hong Kong street scene from a slightly elevated perspective, with towering high-rise skyscrapers, neon shop signs, colorful billboards, and iconic red vertical Cantonese signage stretching far into the distance. Include green minibuses, red taxis, street vendors, and pedestrians in foreground, midground, and background layers. Overhead sign, and urban clutter add richness and scale. Atmospheric haze, reflections on wet pavement, and warm glowing lights enhance the bustling night-time city vibe and sense of depth."
  };

  return backgroundMap[background] || background;
}

/**
 * Maps style selections to detailed artistic style descriptions
 */
function getStyleDescription(style: string): string {
  const styleMap: Record<string, string> = {
    "watercolor": "Studio Ghibli anime, hand-drawn watercolor look, soft confident linework, pastel colors, textured brush-style shading, subtle grain, traditional animation background aesthetics, warm whimsical mood, painterly surfaces, distinctly illustrated finish.",
    "realistic": " Ultra-realistic high-end advertising style, photorealistic, cinematic lighting. All natural elements (mountains, trees, vegetation, clouds) and architectural elements (buildings, roads, tram, harbour) should appear fully photo-real, with realistic textures, accurate proportions, and natural details. Sharp high-resolution detail, precise shadows, reflections, and subtle depth of field.",
    "papercraft": "Paper craft / cutout style, handcrafted aesthetic, layered paper textures with visible edges, shadows and subtle depth between layers, crisp clean shapes, colorful and tactile surfaces. Natural and architectural elements (mountains, trees, buildings, vehicles) rendered as stylized paper cutouts, with slight dimensionality and soft shadowing for depth."
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
   const fullPrompt = `A Christmas card front cover illustration.
Background: ${backgroundDescription}
Artistic style: ${styleDescription}`;

   console.log("Full prompt being sent:", fullPrompt);

  const response = await amplifyClient.queries.askBedrock({
    prompt: fullPrompt,
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