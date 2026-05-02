import { ThemeType, ThemeColors } from '../types/game';
import { THEMES } from '../constants/game';

interface ThemesBarProps {
  currentTheme: ThemeType;
  onChangeTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
}

export function ThemesBar({ currentTheme, onChangeTheme, colors }: ThemesBarProps) {
  return (
    <div className="themes-bar">
      {(Object.keys(THEMES) as ThemeType[]).map(theme => (
        <button
          key={theme}
          className={`theme-btn ${currentTheme === theme ? 'active' : ''}`}
          style={{
            borderColor: currentTheme === theme ? colors.highlight : colors.gridLine,
            color: colors.text,
          }}
          onClick={() => onChangeTheme(theme)}
        >
          {THEMES[theme].name}
        </button>
      ))}
    </div>
  );
}
