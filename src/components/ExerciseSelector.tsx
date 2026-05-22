import { VISIBLE_EXERCISE_TYPES } from '../config/featureFlags';
import { useLanguage } from '../i18n/useLanguage';
import {
  difficultyKey,
  exerciseLabelKey,
} from '../i18n/translations';
import {
  EXERCISE_DEFINITIONS,
} from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';

interface ExerciseSelectorProps {
  value: ExerciseType;
  onChange: (exercise: ExerciseType) => void;
}

export function ExerciseSelector({ value, onChange }: ExerciseSelectorProps) {
  const { t } = useLanguage();

  const handleSelect = (exercise: ExerciseType) => {
    if (exercise !== value) {
      onChange(exercise);
    }
  };

  return (
    <fieldset className="selector exercise-selector">
      <legend>{t('exerciseSelect.legend')}</legend>
      <div className="exercise-options">
        {VISIBLE_EXERCISE_TYPES.map((exercise) => {
          const def = EXERCISE_DEFINITIONS[exercise];
          const showDifficultyTag = def.difficulty !== 'easy';

          return (
            <label
              key={exercise}
              className={`exercise-option${value === exercise ? ' exercise-option--active' : ''}`}
            >
              <input
                type="radio"
                name="exercise"
                value={exercise}
                checked={value === exercise}
                onChange={() => handleSelect(exercise)}
              />
              <span className="exercise-option-label">
                {t(exerciseLabelKey(exercise))}
              </span>
              {showDifficultyTag && (
                <span className="exercise-option-tag">
                  {t(difficultyKey(def.difficulty))}
                </span>
              )}
            </label>
          );
        })}
      </div>
      {value === 'KNNK' && (
        <p className="exercise-special-notice" role="note">
          {t('exerciseSelect.knnkNotice')}
        </p>
      )}
    </fieldset>
  );
}
