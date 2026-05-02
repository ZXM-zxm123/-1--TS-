import { useGameState } from './hooks/useGameState';
import { GameGrid } from './components/GameGrid';
import { ItemsBar } from './components/ItemsBar';
import { ThemesBar } from './components/ThemesBar';
import { LevelSelect } from './components/LevelSelect';
import { GameModal } from './components/GameModal';
import { StatsBar } from './components/StatsBar';
import { TargetBar } from './components/TargetBar';
import { ActionsBar } from './components/ActionsBar';
import { ComboDisplay } from './components/ComboDisplay';

export default function App() {
  const {
    gameState,
    selectedItem,
    comboDisplay,
    selectLevel,
    changeTheme,
    useItem,
    restartLevel,
    nextLevel,
    setSelectedItem,
    handleCellClick,
    colors,
  } = useGameState();

  const containerClass = `game-container theme-${gameState.theme}`;

  return (
    <div className={containerClass} style={{ background: colors.background, borderColor: colors.gridLine }}>
      <div className="game-header">
        <h1 className="game-title">熔炉锻造</h1>
        <div className="level-indicator">第 {gameState.level} 关 / 共 5 关</div>
      </div>

      <LevelSelect
        currentLevel={gameState.level}
        fastestTimes={gameState.fastestTimes}
        onSelectLevel={selectLevel}
        colors={colors}
      />

      <StatsBar
        steps={gameState.steps}
        score={gameState.score}
        combo={gameState.combo}
        colors={colors}
      />

      <GameGrid
        grid={gameState.grid}
        selectedCell={gameState.selectedCell}
        handleCellClick={handleCellClick}
        colors={colors}
        gameStatus={gameState.gameStatus}
      />

      <TargetBar
        targetMetal={gameState.targetMetal}
        targetCount={gameState.targetCount}
        currentProgress={gameState.currentTargetProgress}
        colors={colors}
      />

      <ItemsBar
        items={gameState.items}
        selectedItem={selectedItem}
        onUseItem={useItem}
        onCancelItem={() => setSelectedItem(null)}
        colors={colors}
      />

      <ActionsBar
        onRestart={restartLevel}
        onNextLevel={nextLevel}
        canGoNext={gameState.level < 5 && gameState.gameStatus === 'won'}
        colors={colors}
      />

      <ThemesBar
        currentTheme={gameState.theme}
        onChangeTheme={changeTheme}
        colors={colors}
      />

      <ComboDisplay combo={comboDisplay} colors={colors} />

      {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
        <GameModal
          status={gameState.gameStatus}
          score={gameState.score}
          level={gameState.level}
          fastestTime={gameState.fastestTimes[gameState.level]}
          onRestart={restartLevel}
          onNextLevel={nextLevel}
          canGoNext={gameState.level < 5}
          colors={colors}
        />
      )}
    </div>
  );
}
