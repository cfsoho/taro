// utils/calcZiwei.ts

import { EARTHLY_BRANCHES } from './constants';

/**
 * 根據農曆月份與地支時辰，計算命宮 index（0 ~ 11）
 * @param lunarMonth 農曆月（1~12）
 * @param hourZhi 時辰地支（如「子」、「丑」...）
 */
export function getMingGongIndex(lunarMonth: number, hourZhi: string): number {
  const hourIndex = EARTHLY_BRANCHES.indexOf(hourZhi);
  if (hourIndex === -1) throw new Error("Invalid hour zhi: " + hourZhi);

  // 命宮位置計算公式：（農曆月數 + 時辰地支序）% 12
  return (lunarMonth + hourIndex) % 12;
}
