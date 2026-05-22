import { useLanguage } from '../i18n/useLanguage';

interface GameBoardActionsProps {
  isPlaying: boolean;
  onAbort: () => void;
  onGoHome: () => void;
}

export function GameBoardActions({
  isPlaying,
  onAbort,
  onGoHome,
}: GameBoardActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="game-board-actions">
      {isPlaying ? (
        <button
          type="button"
          className="btn-board-exit btn-board-exit--abort"
          onClick={onAbort}
        >
          {t('boardActions.abort')}
        </button>
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
