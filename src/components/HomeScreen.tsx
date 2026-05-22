import { isExerciseFullyImplemented } from '../config/exerciseImplementation';
import { useLanguage } from '../i18n/useLanguage';
import {
  difficultyKey,
  exerciseReadmeKey,
  getMateLabel,
} from '../i18n/translations';
import { FEATURE_FLAGS } from '../config/featureFlags';
import {
  EXERCISE_DEFINITIONS,
  EXERCISE_TYPES,
  isSpecialExercise,
} from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';
import { getExercisePieceIcons } from './exercisePieceIcons';

interface HomeScreenProps {
  onSelectExercise: (exercise: ExerciseType) => void;
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
              <button
                type="button"
                className={`home-exercise-card${enabled ? '' : ' home-exercise-card--disabled'}`}
                disabled={!enabled}
                onClick={() => onSelectExercise(code)}
              >
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
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
