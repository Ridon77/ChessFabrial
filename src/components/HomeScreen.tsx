import { isExerciseFullyImplemented } from '../config/exerciseImplementation';
import { isTrainingModeAvailable } from '../config/trainingMode';
import { useLanguage } from '../i18n/useLanguage';
import {
  difficultyKey,
  exerciseDescriptionKey,
  exerciseReadmeKey,
  getMateLabel,
  trainingModeShortKey,
} from '../i18n/translations';
import { FEATURE_FLAGS } from '../config/featureFlags';
import {
  EXERCISE_DEFINITIONS,
  EXERCISE_TYPES,
  isSpecialExercise,
} from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';
import { TRAINING_MODES, type TrainingMode } from '../types/TrainingMode';
import { getExercisePieceIcons } from './exercisePieceIcons';

interface HomeScreenProps {
  onSelectExercise: (exercise: ExerciseType, trainingMode: TrainingMode) => void;
}

export function HomeScreen({ onSelectExercise }: HomeScreenProps) {
  const { t, language } = useLanguage();

  return (
    <section className="home-screen" aria-labelledby="home-screen-title">
      <h2 id="home-screen-title" className="home-screen-title">
        {t('home.title')}
      </h2>
      <p className="home-screen-intro">{t('home.intro')}</p>

      <ul className="home-exercise-grid">
        {EXERCISE_TYPES.map((code) => {
          const def = EXERCISE_DEFINITIONS[code];
          const enabled = isExerciseFullyImplemented(code);
          const icons = getExercisePieceIcons(code);

          return (
            <li key={code}>
              <article
                className={`home-exercise-card${enabled ? '' : ' home-exercise-card--disabled'}`}
              >
                <div className="home-exercise-card__body">
                  <span className="home-exercise-card__icons" aria-hidden="true">
                    {icons.white.map((src, index) => (
                      <img
                        key={`${code}-w-${index}`}
                        src={src}
                        alt=""
                        className="home-exercise-card__piece"
                      />
                    ))}
                    <span className="home-exercise-card__vs">{t('home.vs')}</span>
                    <img
                      src={icons.blackKing}
                      alt=""
                      className="home-exercise-card__piece home-exercise-card__piece--black"
                    />
                  </span>

                  <span className="home-exercise-card__name">
                    {t(exerciseReadmeKey(code))}
                  </span>

                  <p className="home-exercise-card__description">
                    {t(exerciseDescriptionKey(code))}
                  </p>

                  <span className="home-exercise-card__meta">
                    {!FEATURE_FLAGS.showDefenseMode && (
                      <span className="home-exercise-card__tag home-exercise-card__tag--mode">
                        {t('home.modeAttack')}
                      </span>
                    )}
                    <span className="home-exercise-card__tag">
                      {t(difficultyKey(def.difficulty))}
                    </span>
                    <span className="home-exercise-card__tag home-exercise-card__tag--mate">
                      {t('home.matePrefix')}{' '}
                      {getMateLabel(
                        language,
                        code,
                        isSpecialExercise(code),
                        def.forceableMate,
                      )}
                    </span>
                  </span>

                  {!enabled && (
                    <span className="home-exercise-card__soon">
                      {t('home.comingSoon')}
                    </span>
                  )}
                </div>

                <div
                  className="home-exercise-card__modes"
                  role="group"
                  aria-label={t('home.trainingModes', {
                    exercise: t(exerciseReadmeKey(code)),
                  })}
                >
                  {TRAINING_MODES.map((mode) => {
                    const modeEnabled = isTrainingModeAvailable(code, mode);
                    const modeDisabled = !modeEnabled;
                    const showComingSoon =
                      enabled && modeDisabled && mode !== 'hard';
                    const pendingTitle =
                      mode === 'learning' && modeDisabled
                        ? t('trainingMode.learningPending')
                        : showComingSoon
                          ? t('home.comingSoon')
                          : undefined;

                    return (
                      <button
                        key={mode}
                        type="button"
                        className="home-exercise-card__mode-btn"
                        disabled={modeDisabled}
                        title={pendingTitle}
                        aria-label={
                          pendingTitle
                            ? `${t(trainingModeShortKey(mode))}. ${pendingTitle}`
                            : t(trainingModeShortKey(mode))
                        }
                        onClick={() => onSelectExercise(code, mode)}
                      >
                        <span className="home-exercise-card__mode-label">
                          {t(trainingModeShortKey(mode))}
                        </span>
                        {showComingSoon && (
                          <span className="home-exercise-card__mode-soon">
                            {t('home.comingSoon')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
