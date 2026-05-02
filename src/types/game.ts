export type MetalType = 'copper' | 'iron' | 'silver' | 'gold' | 'mithril' | 'orichalcum';
export type CellType = MetalType | 'impurity' | 'empty';
export type ItemType = 'speedMelt' | 'precision' | 'shield';
export type ThemeType = 'lava' | 'coldIron' | 'gold';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  type: CellType;
  metalType?: MetalType;
  id: string;
}

export interface Item {
  type: ItemType;
  name: string;
  icon: string;
  count: number;
}

export interface Level {
  level: number;
  targetMetal: MetalType;
  targetCount: number;
  initialCopperCount: number;
  impurityCount: number;
}

export interface GameState {
  grid: Cell[][];
  selectedCell: Position | null;
  steps: number;
  score: number;
  combo: number;
  level: number;
  items: Item[];
  targetMetal: MetalType;
  targetCount: number;
  currentTargetProgress: number;
  gameStatus: GameStatus;
  theme: ThemeType;
  fastestTimes: Record<number, number>;
  isAnimating: boolean;
}

export interface ThemeColors {
  background: string;
  gridLine: string;
  highlight: string;
  text: string;
  cell: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}
