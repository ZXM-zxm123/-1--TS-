import { useState, useCallback, useEffect } from 'react';
import { GameState, MetalType, Position, Cell, ThemeType, Item, ItemType } from '../types/game';
import { GRID_SIZE, LEVELS, METAL_INFO, ITEM_INFO } from '../constants/game';
import {
  initializeGrid,
  cloneGrid,
  getNextMetalType,
  areAdjacent,
  createMetalCell,
  createEmptyCell,
  createImpurityCell,
  getThemeColors,
  saveGameData,
  loadGameData,
  updateFastestTime,
  findSynthesizablePair,
} from '../utils/gameLogic';

const initialItems: Item[] = [
  { type: 'speedMelt', ...ITEM_INFO.speedMelt, count: 2 },
  { type: 'precision', ...ITEM_INFO.precision, count: 2 },
  { type: 'shield', ...ITEM_INFO.shield, count: 1 },
];

function createInitialState(level: number, theme: ThemeType): GameState {
  const levelConfig = LEVELS[level - 1];
  return {
    grid: initializeGrid(levelConfig.initialCopperCount, levelConfig.impurityCount),
    selectedCell: null,
    steps: 40,
    score: 0,
    combo: 0,
    level,
    items: [...initialItems],
    targetMetal: levelConfig.targetMetal,
    targetCount: levelConfig.targetCount,
    currentTargetProgress: 0,
    gameStatus: 'playing',
    theme,
    fastestTimes: {},
    isAnimating: false,
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedData = loadGameData();
    return createInitialState(1, savedData?.selectedTheme || 'lava');
  });
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [comboDisplay, setComboDisplay] = useState(0);
  const [sparkEffects, setSparkEffects] = useState<{ id: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const savedData = loadGameData();
    if (savedData) {
      setGameState(prev => ({
        ...prev,
        fastestTimes: savedData.fastestTimes,
        theme: savedData.selectedTheme,
      }));
    }
  }, []);

  const selectLevel = useCallback((level: number) => {
    setGameState(prev => {
      const newState = createInitialState(level, prev.theme);
      newState.fastestTimes = prev.fastestTimes;
      return newState;
    });
    setSelectedItem(null);
  }, []);

  const changeTheme = useCallback((theme: ThemeType) => {
    setGameState(prev => {
      const newState = { ...prev, theme };
      const savedData = loadGameData();
      saveGameData({ fastestTimes: prev.fastestTimes, selectedTheme: theme });
      return newState;
    });
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing' || gameState.isAnimating) return;

    const clickedCell = gameState.grid[row][col];
    const clickedPos = { row, col };

    if (selectedItem) {
      handleItemUse(clickedPos, clickedCell);
      return;
    }

    if (clickedCell.type !== 'metal' || !clickedCell.metalType) return;

    if (!gameState.selectedCell) {
      setGameState(prev => ({ ...prev, selectedCell: clickedPos }));
      return;
    }

    if (gameState.selectedCell.row === row && gameState.selectedCell.col === col) {
      setGameState(prev => ({ ...prev, selectedCell: null }));
      return;
    }

    if (!areAdjacent(gameState.selectedCell, clickedPos)) {
      setGameState(prev => ({ ...prev, selectedCell: clickedPos }));
      return;
    }

    const selectedCell = gameState.grid[gameState.selectedCell.row][gameState.selectedCell.col];
    if (selectedCell.metalType !== clickedCell.metalType) {
      setGameState(prev => ({ ...prev, selectedCell: clickedPos }));
      return;
    }

    performSynthesis(gameState.selectedCell, clickedPos);
  }, [gameState, selectedItem]);

  const performSynthesis = useCallback((pos1: Position, pos2: Position) => {
    const cell1 = gameState.grid[pos1.row][pos1.col];
    const cell2 = gameState.grid[pos2.row][pos2.col];

    if (cell1.type !== 'metal' || cell2.type !== 'metal' || !cell1.metalType || !cell2.metalType) {
      return;
    }

    const nextMetal = getNextMetalType(cell1.metalType);
    if (!nextMetal) return;

    const sparkId = Math.random().toString(36).substr(2, 9);
    setSparkEffects(prev => [...prev, { id: sparkId, x: pos1.row * 80 + 40, y: pos1.col * 80 + 40 }]);
    setTimeout(() => {
      setSparkEffects(prev => prev.filter(s => s.id !== sparkId));
    }, 500);

    setGameState(prev => {
      const newGrid = cloneGrid(prev.grid);

      const midRow = Math.floor((pos1.row + pos2.row) / 2);
      const midCol = Math.floor((pos1.col + pos2.col) / 2);
      newGrid[midRow][midCol] = createMetalCell(nextMetal);
      newGrid[pos1.row][pos1.col] = createEmptyCell();
      newGrid[pos2.row][pos2.col] = createEmptyCell();

      let newProgress = prev.currentTargetProgress;
      if (nextMetal === prev.targetMetal) {
        newProgress += 1;
      }

      const newCombo = prev.combo + 1;
      const baseScore = METAL_INFO[nextMetal].level * 10;
      const comboScore = baseScore * newCombo;
      const newScore = prev.score + comboScore;

      setComboDisplay(newCombo);
      setTimeout(() => setComboDisplay(0), 1000);

      let newStatus = prev.gameStatus;
      if (newProgress >= prev.targetCount) {
        newStatus = 'won';
        updateFastestTime(prev.level, prev.steps - 1);
      }

      const newSteps = prev.steps - 1;
      if (newSteps <= 0 && newStatus !== 'won') {
        newStatus = 'lost';
      }

      return {
        ...prev,
        grid: newGrid,
        selectedCell: null,
        steps: newSteps,
        score: newScore,
        combo: newCombo,
        currentTargetProgress: newProgress,
        gameStatus: newStatus,
        isAnimating: false,
      };
    });
  }, [gameState.grid]);

  const handleItemUse = useCallback((pos: Position, cell: Cell) => {
    if (!selectedItem) return;

    let newGrid = cloneGrid(gameState.grid);
    let itemUsed = false;

    switch (selectedItem) {
      case 'speedMelt': {
        const pair = findSynthesizablePair(gameState.grid);
        if (pair) {
          const [pos1, pos2] = pair.pair;
          const cell1 = gameState.grid[pos1.row][pos1.col];
          const cell2 = gameState.grid[pos2.row][pos2.col];
          const nextMetal = getNextMetalType(cell1.metalType!);

          if (nextMetal) {
            const midRow = Math.floor((pos1.row + pos2.row) / 2);
            const midCol = Math.floor((pos1.col + pos2.col) / 2);
            newGrid[midRow][midCol] = createMetalCell(nextMetal);
            newGrid[pos1.row][pos1.col] = createEmptyCell();
            newGrid[pos2.row][pos2.col] = createEmptyCell();
            itemUsed = true;

            setGameState(prev => {
              let newProgress = prev.currentTargetProgress;
              if (nextMetal === prev.targetMetal) {
                newProgress += 1;
              }
              const newCombo = 0;
              const newSteps = prev.steps - 1;
              let newStatus = prev.gameStatus;
              if (newProgress >= prev.targetCount) {
                newStatus = 'won';
              } else if (newSteps <= 0) {
                newStatus = 'lost';
              }
              return {
                ...prev,
                grid: newGrid,
                items: prev.items.map(i =>
                  i.type === 'speedMelt' ? { ...i, count: i.count - 1 } : i
                ),
                selectedCell: null,
                steps: newSteps,
                combo: newCombo,
                currentTargetProgress: newProgress,
                gameStatus: newStatus,
              };
            });
          }
        }
        break;
      }
      case 'precision': {
        if (gameState.selectedCell && cell.type === 'metal') {
          const temp = newGrid[gameState.selectedCell.row][gameState.selectedCell.col];
          newGrid[gameState.selectedCell.row][gameState.selectedCell.col] = newGrid[pos.row][pos.col];
          newGrid[pos.row][pos.col] = temp;
          itemUsed = true;
        }
        break;
      }
      case 'shield': {
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            if (newGrid[row][col].type === 'impurity') {
              newGrid[row][col] = createMetalCell('copper');
              itemUsed = true;
            }
          }
        }
        break;
      }
    }

    if (itemUsed) {
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        items: prev.items.map(i =>
          i.type === selectedItem ? { ...i, count: i.count - 1 } : i
        ),
        selectedCell: null,
        steps: prev.steps - 1,
        combo: 0,
        gameStatus: prev.steps <= 1 ? 'lost' : prev.gameStatus,
      }));
    }

    setSelectedItem(null);
  }, [selectedItem, gameState]);

  const useItem = useCallback((itemType: ItemType) => {
    const item = gameState.items.find(i => i.type === itemType);
    if (!item || item.count <= 0) return;
    setSelectedItem(itemType);
  }, [gameState.items]);

  const restartLevel = useCallback(() => {
    setGameState(prev => {
      const newState = createInitialState(prev.level, prev.theme);
      newState.fastestTimes = prev.fastestTimes;
      return newState;
    });
    setSelectedItem(null);
  }, []);

  const nextLevel = useCallback(() => {
    if (gameState.level < 5) {
      selectLevel(gameState.level + 1);
    }
  }, [gameState.level, selectLevel]);

  return {
    gameState,
    selectedItem,
    comboDisplay,
    sparkEffects,
    selectLevel,
    changeTheme,
    handleCellClick,
    useItem,
    restartLevel,
    nextLevel,
    setSelectedItem,
    colors: getThemeColors(gameState.theme),
  };
}
