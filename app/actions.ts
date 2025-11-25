// src/app/actions.ts
import { amplifyClient } from "@/app/amplify-utils";
import { getBackgroundDescription, getStyleDescription } from "@/lib/prompts";

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