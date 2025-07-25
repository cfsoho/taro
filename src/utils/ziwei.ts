import { convertToLunar } from './lunarConverter';
import { getCorrectedZhi } from './solarTimeCorrector';
import { getMingGongIndex } from './calcZiwei';
import { getPalaceList } from './palaces';
import { assignMainStarsToPalaces } from './starPlacement';
import { assignLifeStar, assignBodyStar, assignLuckyEvilStars, assignTransformStars } from './starAssignment'; // ✅ 引入命主、身主邏輯
import { Palace } from './types';

/**
 * 傳入西元生日與經度，取得對應的紫微十二宮排列（含主星、命主、身主）
 */
export function getZiweiPalaces(
  birthDatetime: string,
  lng: number
): { palaces: Palace[]; mingIndex: number } {
  const date = new Date(birthDatetime);
  const lunar = convertToLunar(date);
  const correctedZhi = getCorrectedZhi(date, lng); // corrected Zhi for ming
  const mingIndex = getMingGongIndex(lunar.lunarMonth, correctedZhi);
  const palaces = getPalaceList(mingIndex);

  // ⭐ 排入十四主星
  let result = assignMainStarsToPalaces(palaces, mingIndex);

  // ⭐ 排入命主星
  result = assignLifeStar(result, lunar.lunar, mingIndex);

  // ⭐ 計算身宮位置（通常與命宮不同）
  const shenIndex = (mingIndex + 4) % 12 || 12; // 範例邏輯，可換掉
  result = assignBodyStar(result, lunar.lunar, shenIndex);
  result = assignLuckyEvilStars(result, lunar.lunar);
  result = assignTransformStars(result, lunar.lunar);

  return { palaces: result, mingIndex };
}
