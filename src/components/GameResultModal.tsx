import {
  getModeLabelShort,
  getResultBriefMessage,
  getResultTitle,
  getTrainingModeLabel,
  type GameEndModalData,
} from '../chess/gameResultMessages';
import { exerciseLabelKey } from '../i18n/translations';
import { useLanguage } from '../i18n/useLanguage';

interface GameResultModalProps {
  data: GameEndModalData;
  onReplay: () => void;
  onReturnPrevious?: () => void;
  onViewBoard: () => void;
  onGoHome: () => void;
}

export function GameResultModal({
  data,
  onReplay,
  onReturnPrevious,
  onViewBoard,
  onGoHome,
}: GameResultModalProps) {
  const { t, language } = useLanguage();
  const title = getResultTitle(language, data.outcome);
  const message = getResultBriefMessage(
    language,
    data.outcome,
    data.status,
    data.exercise,
    data.drawReason,
  );

  return (
    <div className="game-result-overlay" role="presentation">
      <div
        className={`game-result-modal game-result-modal--${data.outcome}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-result-title"
        aria-describedby="game-result-message"
      >
        <h2 id="game-result-title" className="game-result-title">
          {title}
        </h2>

        <p id="game-result-message" className="game-result-message">
          {message}
        </p>

        <dl className="game-result-details">
          <div className="game-result-details-row">
            <dt>{t('result.exercise')}</dt>
            <dd>{t(exerciseLabelKey(data.exercise))}</dd>
          </div>
          <div className="game-result-details-row">
            <dt>{t('result.sideMode')}</dt>
            <dd>{getModeLabelShort(language, data.mode)}</dd>
          </div>
          <div className="game-result-details-row">
            <dt>{t('result.trainingMode')}</dt>
            <dd>{getTrainingModeLabel(language, data.trainingMode)}</dd>
          </div>
          <div className="game-result-details-row">
            <dt>{t('result.moves')}</dt>
            <dd>{data.playerMoves}</dd>
          </div>
        </dl>

        <div className="game-result-actions">
          <button type="button" className="btn-action" onClick={onReplay}>
            {t('result.replay')}
          </button>
          {onReturnPrevious && (
            <button
              type="button"
              className="btn-action btn-action--secondary"
              onClick={onReturnPrevious}
            >
              {t('result.returnPrevious')}
            </button>
          )}
          <button
            type="button"
            className="btn-action btn-action--secondary"
            onClick={onViewBoard}
          >
            {t('result.viewBoard')}
          </button>
          <button
            type="button"
            className="btn-action btn-action--secondary"
            onClick={onGoHome}
          >
            {t('result.goHome')}
          </button>
        </div>
      </div>
    </div>
  );
}
