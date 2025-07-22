import { convertToLunar } from './lunarConverter';
import { getCorrectedZhi } from './solarTimeCorrector';
import { getMingGongIndex } from './calcZiwei';
import { getPalaceList, Palace } from './palaces';

/**
 * 傳入西元生日與經度，取得對應的紫微十二宮排列
 * @param birthDatetime 西元生日字串（ISO 格式）
 * @param lng 經度（出生地），正值為東經，負值為西經
 */
// utils/ziwei.ts
export function getZiweiPalaces(birthDatetime: string, lng: number): { palaces: Palace[], mingIndex: number } {
  const date = new Date(birthDatetime);
  const lunar = convertToLunar(date);
  const correctedZhi = getCorrectedZhi(date, lng);
  const mingIndex = getMingGongIndex(lunar.lunarMonth, correctedZhi);
  const palaces = getPalaceList(mingIndex);
  return { palaces, mingIndex };
}