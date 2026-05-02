import { ThemeColors } from '../types/game';

interface ActionsBarProps {
  onRestart: () => void;
  onNextLevel: () => void;
  canGoNext: boolean;
  colors: ThemeColors;
}

export function ActionsBar({ onRestart, onNextLevel, canGoNext, colors }: ActionsBarProps) {
  return (
    <div className="actions-bar">
      <button
        className="btn"
        style={{
          borderColor: colors.gridLine,
          color: colors.text,
        }}
        onClick={onRestart}
      >
        重新开始
      </button>
      {canGoNext && (
        <button
          className="btn"
          style={{
            borderColor: colors.highlight,
            color: colors.highlight,
          }}
          onClick={onNextLevel}
        >
          下一关
        </button>
      )}
    </div>
  );
}
