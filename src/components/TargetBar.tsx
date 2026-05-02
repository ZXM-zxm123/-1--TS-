import { MetalType, ThemeColors } from '../types/game';
import { METAL_INFO } from '../constants/game';

interface TargetBarProps {
  targetMetal: MetalType;
  targetCount: number;
  currentProgress: number;
  colors: ThemeColors;
}

export function TargetBar({ targetMetal, targetCount, currentProgress, colors }: TargetBarProps) {
  const metalInfo = METAL_INFO[targetMetal];

  return (
    <div className="target-bar" style={{ background: colors.cell }}>
      <div className="target-label" style={{ color: colors.text }}>
        目标
      </div>
      <div className="target-progress">
        <span
          className="target-metal"
          style={{
            background: `${metalInfo.color}33`,
            color: metalInfo.color,
            border: `2px solid ${metalInfo.color}`,
          }}
        >
          {metalInfo.name} ({metalInfo.symbol})
        </span>
        <span style={{ color: colors.text }}>
          {currentProgress} / {targetCount}
        </span>
      </div>
    </div>
  );
}
