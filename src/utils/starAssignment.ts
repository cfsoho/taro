// utils/starAssignment.ts
import { Palace, Star } from './types';
import {
  LIFE_STAR_MAP,
  BODY_STAR_MAP,
  LUCKY_STAR_RULES,
  EVIL_STAR_RULES,
  TRANSFORM_STAR_RULES
} from './constants';
import { Lunar } from 'lunar-typescript';
import rawStars from '../data/star.json';

const allStars: Star[] = rawStars as Star[];

export function assignLifeStar(palaces: Palace[], lunar: Lunar, mingIndex: number): Palace[] {
  const yearGan = lunar.getYearGan();
  const starName = LIFE_STAR_MAP[yearGan];
  const star = allStars.find(s => s.name === starName);
  if (!star) return palaces;

  const palace = palaces.find(p => p.position === mingIndex);
  if (palace) {
    palace.stars ??= [];
    palace.stars.push({ ...star, type: 'life' }); // 註記為命主星
  }

  return palaces;
}

export function assignBodyStar(palaces: Palace[], lunar: Lunar, shenIndex: number): Palace[] {
  const hourZhi = lunar.getTimeZhi();
  const starName = BODY_STAR_MAP[hourZhi];
  const star = allStars.find(s => s.name === starName);
  if (!star) return palaces;

  const palace = palaces.find(p => p.position === shenIndex);
  if (palace) {
    palace.stars ??= [];
    palace.stars.push({ ...star, type: 'body' }); // 註記為身主星
  }

  return palaces;
}

export function assignLuckyEvilStars(palaces: Palace[], lunar: Lunar): Palace[] {
  const yearGan = lunar.getYearGan();
  const yearZhi = lunar.getYearZhi();

  const luckyStars = (LUCKY_STAR_RULES[yearGan] || [])
    .map(name => allStars.find(s => s.name === name && s.type === 'lucky'))
    .filter((s): s is typeof allStars[number] => s !== undefined);

  const evilStars = (EVIL_STAR_RULES[yearZhi] || [])
    .map(name => allStars.find(s => s.name === name && s.type === 'evil'))
    .filter((s): s is typeof allStars[number] => s !== undefined);

  const mingPalace = palaces.find(p => p.name === '命宮');

  if (mingPalace) {
    mingPalace.stars ??= [];
    mingPalace.stars.push(...luckyStars, ...evilStars);
  }

  return palaces;
}

export function assignTransformStars(palaces: Palace[], lunar: Lunar): Palace[] {
  const yearGan = lunar.getYearGan();
  const transformRule = TRANSFORM_STAR_RULES[yearGan];
  if (!transformRule) return palaces;

  for (const [typeLabel, starName] of Object.entries(transformRule)) {
    const palace = palaces.find(p => p.stars?.some(s => s.name === starName));
    if (palace) {
      const star = palace.stars!.find(s => s.name === starName);
      if (star) {
        star.transform = typeLabel as '祿' | '權' | '科' | '忌';
      }
    }
  }

  return palaces;
}
