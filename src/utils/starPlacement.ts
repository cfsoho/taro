// utils/starPlacement.ts
import { Palace, Star, StarType } from './types';
import mainStars from '../data/star.json';
// import { getEarthlyBranchIndex } from './utils'; // 可暫時移除

const MAIN_STARS: Star[] = mainStars.map(s => ({
  name: s.name,
  type: s.type as StarType
}));

export function assignMainStarsToPalaces(palaces: Palace[], mingIndex: number): Palace[] {
  const result = palaces.map(p => ({ ...p, stars: [] as Star[] }));

  for (let i = 0; i < MAIN_STARS.length; i++) {
    const targetPos = ((mingIndex + i) % 12) + 1;
    const palace = result.find(p => p.position === targetPos);
    if (palace) {
      palace.stars.push(MAIN_STARS[i]);
    }
  }

  return result;
}
