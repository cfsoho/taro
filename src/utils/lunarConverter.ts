import { Lunar } from 'lunar-typescript';
import { getCorrectedZhi } from './solarTimeCorrector';

/**
 * 將西元時間轉換為農曆資訊，並依經度修正真太陽時地支
 */
export function convertToLunar(date: Date, lng?: number) {
  const lunar = Lunar.fromDate(date);

  const zhi = lng !== undefined ? getCorrectedZhi(date, lng) : lunar.getTimeZhi();

  return {
    lunarYear: lunar.getYear(),
    lunarMonth: lunar.getMonth(),
    lunarDay: lunar.getDay(),
    lunarHour: zhi,
    lunarMonthName: lunar.getMonthInChinese(),
    lunarDayName: lunar.getDayInChinese(),
    lunarHourName: zhi,
    eightChar: lunar.getEightChar(), // 仍然是未修正的（可擴充）
    lunar,
  };
}
