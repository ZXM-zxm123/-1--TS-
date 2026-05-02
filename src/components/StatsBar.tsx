import { ThemeColors } from '../types/game';

interface StatsBarProps {
  steps: number;
  score: number;
  combo: number;
  colors: ThemeColors;
}

export function StatsBar({ steps, score, combo, colors }: StatsBarProps) {
  return (
    <div className="stats-bar" style={{ background: colors.cell }}>
      <div className="stat">
        <div className="stat-label" style={{ color: colors.text }}>
          步数
        </div>
        <div
          className="stat-value"
          style={{ color: steps <= 5 ? '#ff4444' : colors.highlight }}
        >
          {steps}
        </div>
      </div>
      <div className="stat">
        <div className="stat-label" style={{ color: colors.text }}>
          分数
        </div>
        <div className="stat-value" style={{ color: colors.highlight }}>
          {score}
        </div>
      </div>
      <div className="stat">
        <div className="stat-label" style={{ color: colors.text }}>
          连击
        </div>
        <div
          className="stat-value"
          style={{ color: combo > 0 ? '#00ff00' : colors.highlight }}
        >
          {combo}x
        </div>
      </div>
    </div>
  );
}
