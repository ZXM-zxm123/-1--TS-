import { ThemeColors } from '../types/game';

interface LevelSelectProps {
  currentLevel: number;
  fastestTimes: Record<number, number>;
  onSelectLevel: (level: number) => void;
  colors: ThemeColors;
}

export function LevelSelect({ currentLevel, fastestTimes, onSelectLevel, colors }: LevelSelectProps) {
  return (
    <div className="level-select">
      {[1, 2, 3, 4, 5].map(level => {
        const isCompleted = fastestTimes[level] !== undefined;
        const isActive = currentLevel === level;
        const className = `level-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;

        return (
          <button
            key={level}
            className={className}
            style={{
              borderColor: isActive ? colors.highlight : colors.gridLine,
              color: colors.text,
              background: isActive ? `${colors.highlight}33` : colors.cell,
            }}
            onClick={() => onSelectLevel(level)}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
