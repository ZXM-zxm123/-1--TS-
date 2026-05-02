import { Cell, CellType, MetalType, Position, ThemeType, GameState } from '../types/game';
import { GRID_SIZE, METAL_ORDER, THEMES, STORAGE_KEY, LEVELS } from '../constants/game';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createEmptyCell(): Cell {
  return { type: 'empty', id: generateId() };
}

export function createMetalCell(metalType: MetalType): Cell {
  return { type: metalType, metalType, id: generateId() };
}

export function createImpurityCell(): Cell {
  return { type: 'impurity', id: generateId() };
}

export function getNextMetalType(metal: MetalType): MetalType | null {
  const currentIndex = METAL_ORDER.indexOf(metal);
  if (currentIndex === -1 || currentIndex >= METAL_ORDER.length - 1) {
    return null;
  }
  return METAL_ORDER[currentIndex + 1];
}

export function areAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function getAdjacentCells(grid: Cell[][], pos: Position): Position[] {
  const adjacent: Position[] = [];
  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
  ];

  for (const dir of directions) {
    const newRow = pos.row + dir.row;
    const newCol = pos.col + dir.col;
    if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
      adjacent.push({ row: newRow, col: newCol });
    }
  }

  return adjacent;
}

export function canSynthesize(cell1: Cell, cell2: Cell): boolean {
  if (cell1.type !== 'metal' || cell2.type !== 'metal') {
    return false;
  }
  return cell1.metalType === cell2.metalType;
}

export function initializeGrid(initialCopperCount: number, impurityCount: number): Cell[][] {
  const grid: Cell[][] = [];
  const totalCells = GRID_SIZE * GRID_SIZE;
  const filledCells: number[] = [];

  for (let i = 0; i < totalCells - initialCopperCount - impurityCount; i++) {
    filledCells.push(0);
  }
  for (let i = 0; i < initialCopperCount; i++) {
    filledCells.push(1);
  }
  for (let i = 0; i < impurityCount; i++) {
    filledCells.push(2);
  }

  for (let i = filledCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filledCells[i], filledCells[j]] = [filledCells[j], filledCells[i]];
  }

  let cellIndex = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      const cellValue = filledCells[cellIndex++];
      if (cellValue === 0) {
        grid[row][col] = createEmptyCell();
      } else if (cellValue === 1) {
        grid[row][col] = createMetalCell('copper');
      } else {
        grid[row][col] = createImpurityCell();
      }
    }
  }

  return grid;
}

export function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

export function getThemeColors(theme: ThemeType) {
  return THEMES[theme].colors;
}

export function saveGameData(data: { fastestTimes: Record<number, number>; selectedTheme: ThemeType }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadGameData(): { fastestTimes: Record<number, number>; selectedTheme: ThemeType } | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

export function updateFastestTime(level: number, steps: number): boolean {
  const data = loadGameData();
  const fastestTimes = data?.fastestTimes || {};
  if (!fastestTimes[level] || steps < fastestTimes[level]) {
    fastestTimes[level] = steps;
    saveGameData({ fastestTimes, selectedTheme: data?.selectedTheme || 'lava' });
    return true;
  }
  return false;
}

export function findSynthesizablePair(grid: Cell[][]): { pair: [Position, Position]; newMetal: MetalType } | null {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];
      if (cell.type !== 'metal' || !cell.metalType) continue;

      const adjacent = getAdjacentCells(grid, { row, col });
      for (const adj of adjacent) {
        const adjCell = grid[adj.row][adj.col];
        if (adjCell.type === 'metal' && adjCell.metalType === cell.metalType) {
          const nextMetal = getNextMetalType(cell.metalType);
          if (nextMetal) {
            return {
              pair: [{ row, col }, adj],
              newMetal: nextMetal,
            };
          }
        }
      }
    }
  }
  return null;
}

export function hasValidMoves(grid: Cell[][]): boolean {
  return findSynthesizablePair(grid) !== null;
}
