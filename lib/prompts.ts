/**
 * Maps background selections to detailed prompt descriptions
 */
export function getBackgroundDescription(background: string): string {
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
export function getStyleDescription(style: string): string {
    const styleMap: Record<string, string> = {
      "cartoon": "Studio Ghibli anime, hand-drawn watercolor look, soft confident linework, pastel colors, textured brush-style shading, subtle grain, traditional animation background aesthetics, warm whimsical mood, painterly surfaces, distinctly illustrated finish.",
      "realistic": " Ultra-realistic high-end advertising style, photorealistic, cinematic lighting. All natural elements (mountains, trees, vegetation, clouds) and architectural elements (buildings, roads, tram, harbour) should appear fully photo-real, with realistic textures, accurate proportions, and natural details. Sharp high-resolution detail, precise shadows, reflections, and subtle depth of field.",
      "papercraft": "Paper craft / cutout style, handcrafted aesthetic, layered paper textures with visible edges, shadows and subtle depth between layers, crisp clean shapes, colorful and tactile surfaces. Natural and architectural elements (mountains, trees, buildings, vehicles) rendered as stylized paper cutouts, with slight dimensionality and soft shadowing for depth."
    };
  
    return styleMap[style] || style;
}

/**
 * Cantonese translations for background descriptions
 */
export function getBackgroundDescriptionCantonese(background: string): string {
    const backgroundMap: Record<string, string> = {
      "harbour": "香港維多利亞港全景視野，清晰展示國際金融中心、環球貿易廣場與中銀大廈的建築的剪影。天際線與維港佔據畫面上半部分，富有手繪細節、霧氣朦朧、浮雲、水面呈現溫暖光芒",
      "peak": "香港標誌性的太平山頂，從高處俯瞰，有綠色山坡、層層樹木及斜坡小路，中景可見登山纜車沿斜坡行駛。包括歷史性的復古紅色纜車廂配發光小窗與柔和反光。呈現從高處俯瞰的維港及城市，有微弱燈光、帶霧氣朦朧感、浮動雲層和金黃暮色。",
      "city": "微俯視香港街景寬幅畫面，包含高聳密集摩天大樓、霓虹招牌、彩色廣告牌、紅色直式粵語標誌延伸到遠處。前景中景後景有綠色專線小巴、紅色計程車、攤販、行人。懸掛招牌與街道雜物增強豐富度，配合霧氣、濕滑路面反光、溫暖燈光營造繁華的夜間都市氛圍及深度。"
    };
  
    return backgroundMap[background] || background;
}

/**
 * Cantonese translations for style descriptions
 */
export function getStyleDescriptionCantonese(style: string): string {
    const styleMap: Record<string, string> = {
      "cartoon": "吉卜力動畫風格，採用手繪水彩質感、柔和線條、粉嫩色彩、筆觸紋理、細微顆粒。保持傳統動畫背景美學，營造溫暖夢幻氛圍，呈現明顯插畫效果。",
      "realistic": "超高寫實廣告攝影風格，電影級光影設計。所有自然景物（山、樹、草、雲）與建築（大樓、道路、電車、海港）需具真實紋理、準確比例、自然細節。保證高解析度、精確陰影反射、微妙景深。",
      "papercraft": "紙藝裁剪風格，呈現手工疊層質感、明顯紙張邊緣與陰影。造型簡潔俐落，色彩鮮豔觸感豐富。所有自然元素（山、樹）與城市元素（建築、車輛）呈現風格化紙雕造型，有輕微立體層次與柔和陰影展示深度。"
    };
  
    return styleMap[style] || style;
}

/**
 * Translates the full English prompt to Cantonese for display
 */
export function getCantonesePrompt(
  background: string,
  style: string
): string {
  // Get the Cantonese versions
  const backgroundCantonese = getBackgroundDescriptionCantonese(background);
  const styleCantonese = getStyleDescriptionCantonese(style);

  // Build the Cantonese prompt
  return `聖誕卡封面插圖
背景：${backgroundCantonese}
藝術風格：${styleCantonese}`;
}