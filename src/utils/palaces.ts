// utils/places.ts
import palaceData from '../data/palaces.json';

export interface Palace {
  name: string;
  index: number; // 1~12，原始順序
  position: number; // 1~12，命宮起算的排列順序（給九宮格使用）
}

/**
 * 根據命宮 index，重新排列十二宮順序
 * @param mingIndex 命宮 index（0~11，表示 palaces.json 中的第幾個為命宮）
 * @returns 重新排序後的十二宮
 */
export function getPalaceList(mingIndex: number): Palace[] {
  const rotated = [...palaceData.slice(mingIndex), ...palaceData.slice(0, mingIndex)];
  return rotated.map((palace, i) => ({
    ...palace,
    position: i + 1,
  }));
}
