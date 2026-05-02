import { MetalType, Level, Theme, ThemeType } from '../types/game';

export const GRID_SIZE = 5;
export const MAX_STEPS = 40;

export const METAL_ORDER: MetalType[] = ['copper', 'iron', 'silver', 'gold', 'mithril', 'orichalcum'];

export const METAL_INFO: Record<MetalType, { name: string; color: string; symbol: string; level: number }> = {
  copper: { name: '铜', color: '#B87333', symbol: 'Cu', level: 1 },
  iron: { name: '铁', color: '#A19D94', symbol: 'Fe', level: 2 },
  silver: { name: '银', color: '#C0C0C0', symbol: 'Ag', level: 3 },
  gold: { name: '金', color: '#FFD700', symbol: 'Au', level: 4 },
  mithril: { name: '秘银', color: '#7B68EE', symbol: 'Mi', level: 5 },
  orichalcum: { name: '奥利哈钢', color: '#00CED1', symbol: 'Or', level: 6 },
};

export const LEVELS: Level[] = [
  { level: 1, targetMetal: 'iron', targetCount: 1, initialCopperCount: 15, impurityCount: 2 },
  { level: 2, targetMetal: 'silver', targetCount: 1, initialCopperCount: 18, impurityCount: 3 },
  { level: 3, targetMetal: 'gold', targetCount: 1, initialCopperCount: 20, impurityCount: 4 },
  { level: 4, targetMetal: 'mithril', targetCount: 1, initialCopperCount: 20, impurityCount: 5 },
  { level: 5, targetMetal: 'orichalcum', targetCount: 1, initialCopperCount: 20, impurityCount: 6 },
];

export const ITEM_INFO = {
  speedMelt: { name: '加速融化', icon: '🔥' },
  precision: { name: '精准定位', icon: '🔄' },
  shield: { name: '保护罩', icon: '🛡️' },
};

export const THEMES: Record<ThemeType, Theme> = {
  lava: {
    name: '熔岩',
    colors: {
      background: '#1a0a0a',
      gridLine: '#4a1a0a',
      highlight: '#ff4500',
      text: '#ffaa00',
      cell: '#2a1515',
    },
  },
  coldIron: {
    name: '寒铁',
    colors: {
      background: '#0a1a2a',
      gridLine: '#2a4a6a',
      highlight: '#00bfff',
      text: '#88ccff',
      cell: '#152535',
    },
  },
  gold: {
    name: '黄金',
    colors: {
      background: '#1a1a0a',
      gridLine: '#4a4a1a',
      highlight: '#ffd700',
      text: '#ffee00',
      cell: '#252515',
    },
  },
};

export const STORAGE_KEY = 'forge-master-data';
