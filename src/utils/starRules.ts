// utils/starRules.ts
import { Star, StarType } from './types';
import { Lunar } from 'lunar-typescript';
import mainStars from '../data/star.json';

// TODO: 你也可以從 JSON 載入主星清單
const MAIN_STARS: Star[] = mainStars.map(s => ({
  name: s.name,
  type: s.type as StarType
}));


/**
 * 主星落宮邏輯（簡化版）
 * @param lunarDate lunar-typescript 的物件
 * @returns 對應宮位與主星對應
 */
export function assignMainStars(lunarDate: Lunar): Record<number, Star[]> {
  const palaceStars: Record<number, Star[]> = {};

  MAIN_STARS.forEach((star, i) => {
    const targetPalace = (lunarDate.getYearZhiIndex() + i) % 12 + 1;

    if (!palaceStars[targetPalace]) {
      palaceStars[targetPalace] = [];
    }
    palaceStars[targetPalace].push(star);
  });

  return palaceStars;
}
