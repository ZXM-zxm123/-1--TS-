import { Cell, Position, GameStatus, ThemeColors } from '../types/game';
import { METAL_INFO } from '../constants/game';
import { useEffect, useRef, useCallback } from 'react';

interface GameGridProps {
  grid: Cell[][];
  selectedCell: Position | null;
  onCellClick: (row: number, col: number) => void;
  handleCellClick: (row: number, col: number) => void;
  colors: ThemeColors;
  gameStatus: GameStatus;
}

export function GameGrid({
  grid,
  selectedCell,
  handleCellClick,
  colors,
}: GameGridProps) {
  return (
    <div className="game-grid" style={{ background: colors.gridLine }}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isSelected =
            selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          return (
            <GridCell
              key={cell.id}
              cell={cell}
              isSelected={isSelected}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              colors={colors}
            />
          );
        })
      )}
    </div>
  );
}

interface GridCellProps {
  cell: Cell;
  isSelected: boolean;
  onClick: () => void;
  colors: ThemeColors;
}

function GridCell({ cell, isSelected, onClick, colors }: GridCellProps) {
  const cellClass = getCellClass(cell, isSelected);
  const style = getCellStyle(cell, colors);

  return (
    <div className={cellClass} style={style} onClick={onClick}>
      {cell.type === 'metal' && cell.metalType && (
        <>
          <span
            className="metal-symbol"
            style={{ color: METAL_INFO[cell.metalType].color }}
          >
            {METAL_INFO[cell.metalType].symbol}
          </span>
          <span className="metal-name" style={{ color: colors.text }}>
            {METAL_INFO[cell.metalType].name}
          </span>
        </>
      )}
      {cell.type === 'impurity' && (
        <span className="metal-symbol" style={{ color: '#666' }}>
          ✖
        </span>
      )}
    </div>
  );
}

function getCellClass(cell: Cell, isSelected: boolean): string {
  let className = 'cell';
  if (cell.type === 'metal') className += ' metal';
  if (cell.type === 'impurity') className += ' impurity';
  if (isSelected) className += ' selected';
  return className;
}

function getCellStyle(cell: Cell, colors: ThemeColors): React.CSSProperties {
  if (cell.type === 'metal' && cell.metalType) {
    return {
      background: `linear-gradient(135deg, ${colors.cell} 0%, ${METAL_INFO[cell.metalType].color}22 100%)`,
    };
  }
  return {
    background: colors.cell,
  };
}
