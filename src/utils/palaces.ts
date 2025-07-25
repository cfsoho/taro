// utils/palaces.ts
import palaceData from '../data/palaces.json';
import { Palace } from './types'; 

export function getPalaceList(mingIndex: number): Palace[] {
  const rotated = [...palaceData.slice(mingIndex), ...palaceData.slice(0, mingIndex)];
  return rotated.map((palace, i) => ({
    ...palace,
    position: i + 1,
    stars: [], // ⭐ 加上空陣列，方便之後動態加入主星等
  }));
}
