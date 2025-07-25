// lib/solarTimeCorrector.ts
import { EARTHLY_BRANCHES } from './constants';

/**
 * 計算真太陽時校正後的地支時辰
 * @param date 當地時間（注意：必須是出生地時間）
 * @param lng 出生地經度（正數為東經，負數為西經）
 * @returns 地支字串（如 "子", "丑", ...）
 */
export function getCorrectedZhi(date: Date, lng: number): string {

  // 當地時間的 UTC+0 時刻（標準時間）
  const utc = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );
  //const localOffsetMin = date.getTimezoneOffset(); // 使用者所在時區相對 UTC 的 offset（單位：分鐘，東八區 = -480）

  // 計算當地時間對應的地方時（Local Mean Time）
  const standardMeridian = Math.round(lng / 15) * 15; // 與出生地經度最接近的整數時區子午線
  const timeDiffMin = 4 * (lng - standardMeridian); // 每度 4 分鐘
  const trueSolarUTC = utc + timeDiffMin * 60 * 1000; // 加上真太陽時差異
  const solarDate = new Date(trueSolarUTC);
  const hour = solarDate.getUTCHours();
  const min = solarDate.getUTCMinutes();

  // 真太陽時轉換為地支（子時 = 23:00 ~ 00:59）
  const totalHour = hour + min / 60;
  const branchIndex = Math.floor(((totalHour + 1) % 24) / 2);
  return EARTHLY_BRANCHES[branchIndex];
}


