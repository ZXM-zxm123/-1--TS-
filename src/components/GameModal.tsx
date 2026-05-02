import { GameStatus, ThemeColors } from '../types/game';
import { METAL_INFO } from '../constants/game';

interface GameModalProps {
  status: GameStatus;
  score: number;
  level: number;
  fastestTime?: number;
  onRestart: () => void;
  onNextLevel: () => void;
  canGoNext: boolean;
  colors: ThemeColors;
}

export function GameModal({
  status,
  score,
  level,
  fastestTime,
  onRestart,
  onNextLevel,
  canGoNext,
  colors,
}: GameModalProps) {
  const isWon = status === 'won';

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        style={{
          background: colors.cell,
          borderColor: colors.highlight,
        }}
      >
        <div className="modal-title" style={{ color: colors.highlight }}>
          {isWon ? '锻造成功!' : '锻造失败'}
        </div>
        <div className="modal-text" style={{ color: colors.text }}>
          第 {level} 关
        </div>
        <div className="modal-score" style={{ color: colors.highlight }}>
          分数: {score}
        </div>
        {isWon && fastestTime && (
          <div className="fastest-time">
            最快: {fastestTime} 步
          </div>
        )}
        <div className="modal-actions">
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
      </div>
    </div>
  );
}
