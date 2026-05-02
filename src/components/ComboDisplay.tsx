import { ThemeColors } from '../types/game';

interface ComboDisplayProps {
  combo: number;
  colors: ThemeColors;
}

export function ComboDisplay({ combo, colors }: ComboDisplayProps) {
  if (combo <= 1) return null;

  return (
    <div
      className="combo-display"
      style={{ color: colors.highlight, textShadow: `0 0 20px ${colors.highlight}` }}
    >
      {combo}x Combo!
    </div>
  );
}
