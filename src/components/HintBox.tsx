import { useState } from 'react';
import { getHintForPlayer } from '../chess/hints';
import { useLanguage } from '../i18n/useLanguage';
import { exerciseTopicKey } from '../i18n/translations';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

interface HintBoxProps {
  exercise: ExerciseType;
  playerSide: PlayerSide;
  fen?: string;
  disabled?: boolean;
}

export function HintBox({
  exercise,
  playerSide,
  fen,
  disabled = false,
}: HintBoxProps) {
  const { t, language } = useLanguage();
  const [hint, setHint] = useState<string | null>(null);
  const topic = t(exerciseTopicKey(exercise));
  const modeHint =
    playerSide === 'white' ? t('side.attackHint') : t('side.defenseHint');

  const handleShowHint = () => {
    setHint(getHintForPlayer(exercise, playerSide, language, fen));
  };

  return (
    <section className="hint-box-panel" aria-labelledby="hint-box-heading">
      <h3 id="hint-box-heading" className="hint-box-heading">
        {t('hints.title')}
      </h3>
      <p className="hint-box-topic">
        {t('hints.topic', { topic, mode: modeHint })}
      </p>
      <button
        type="button"
        className="btn-hint"
        onClick={handleShowHint}
        disabled={disabled}
      >
        {t('hints.show')}
      </button>

      {hint && (
        <aside className="hint-box" role="note">
          <strong>{t('hints.label')}</strong> {hint}
        </aside>
      )}
    </section>
  );
}
