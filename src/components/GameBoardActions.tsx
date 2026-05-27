import { useLanguage } from '../i18n/useLanguage';

interface GameBoardActionsProps {
  isPlaying: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onAbort: () => void;
  onGoHome: () => void;
}

export function GameBoardActions({
  isPlaying,
  canUndo,
  onUndo,
  onAbort,
  onGoHome,
}: GameBoardActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="game-board-actions">
      {isPlaying ? (
        <>
          <button
            type="button"
            className="btn-board-exit btn-board-exit--secondary"
            onClick={onUndo}
            disabled={!canUndo}
          >
            {t('boardActions.undo')}
          </button>
          <button
            type="button"
            className="btn-board-exit btn-board-exit--abort"
            onClick={onAbort}
          >
            {t('boardActions.cancel')}
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn-board-exit"
          onClick={onGoHome}
        >
          {t('boardActions.goHome')}
        </button>
      )}
    </div>
  );
}
