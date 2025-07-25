export type StarType = 'main' | 'lucky' | 'evil' | 'transform' | 'body' | 'life';

export interface Star {
  name: string;
  type: StarType;
  transform?: '祿' | '權' | '科' | '忌';
}

export const STAR_TYPE_LABELS: Record<StarType, string> = {
  main: '主星',
  lucky: '吉星',
  evil: '煞星',
  transform: '化星',
  body: '身主',
  life: '命主',
};

export interface Palace {
  name: string;
  index: number;    // 原始順序 1~12，來自 JSON
  position: number; // 依命宮排序後位置 1~12，給九宮格用
  stars?: Star[];   // ⭐ 你未來要加進去的十四主星、吉星、煞星等
}


