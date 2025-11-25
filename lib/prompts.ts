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
      "harbour": "香港維多利亞港全景，包括國際金融中心、環球貿易廣場同中銀大廈嘅輪廓。天際線同海港佔畫面上半部，有豐富嘅手繪細節、大氣透視、飄浮嘅雲同埋海港水面嘅溫暖光芒",
      "peak": "香港標誌性嘅太平山頂，從高處俯瞰，有翠綠嘅山坡、梯田樹木同蜿蜒嘅小徑，仲有山頂纜車以可見嘅角度上升緊。包括歷史性嘅紅色纜車車廂，有發光嘅小窗同柔和嘅反射光。場景展示從高處俯瞰下面嘅海港同城市，有微弱嘅燈光、大氣透視、飄浮嘅雲同溫暖嘅金色黃昏色調",
      "city": "香港街景從稍微高嘅角度拍攝，有高聳嘅摩天大廈、霓虹招牌、彩色廣告牌，同埋標誌性嘅紅色直立中文招牌延伸到遠處。包括綠色小巴、紅色的士、街邊小販，同埋前景、中景同背景嘅行人。頭頂招牌同城市雜物增添豐富感同規模感。大氣霧霾、濕路面嘅倒影，同溫暖發光嘅燈光營造繁華嘅夜間城市氛圍同深度感"
    };
  
    return backgroundMap[background] || background;
}

/**
 * Cantonese translations for style descriptions
 */
export function getStyleDescriptionCantonese(style: string): string {
    const styleMap: Record<string, string> = {
      "cartoon": "吉卜力工作室動畫風格，手繪水彩效果，柔和流暢嘅線條，粉彩色調，質感筆刷陰影，微妙顆粒感，傳統動畫背景美學，溫暖奇幻嘅氛圍，繪畫般嘅表面，明顯嘅插畫效果",
      "realistic": "超逼真高端廣告風格，照片般真實，電影級燈光。所有自然元素（山脈、樹木、植被、雲朵）同建築元素（建築物、道路、纜車、海港）都應該完全逼真，有真實質感、準確比例同自然細節。銳利高解析度細節、精確陰影、反射同微妙景深",
      "papercraft": "紙藝/剪紙風格，手工製作美學，有可見邊緣嘅分層紙質感、陰影同層次之間嘅微妙深度，乾淨利落嘅形狀，色彩豐富同觸感強嘅表面。自然同建築元素（山脈、樹木、建築物、車輛）呈現為風格化嘅紙張剪影，有輕微立體感同柔和陰影營造深度"
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