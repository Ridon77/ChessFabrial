import type { ExerciseType } from './ExerciseType';

/** Fletxa didàctica d'un pas del tutorial. */
export interface LearningArrow {
  from: string;
  to: string;
}

/** Moviment esperat opcional en un pas del tutorial. */
export interface LearningExpectedMove {
  from?: string;
  to?: string;
}

/** Pas individual d'un tutorial d'aprenentatge. */
export interface LearningStep {
  id: string;
  title: string;
  description: string;
  expectedMove?: LearningExpectedMove;
  highlightSquares?: string[];
  arrows?: LearningArrow[];
}

/** Tutorial complet per a un exercici. */
export interface LearningTutorial {
  exerciseType: ExerciseType;
  steps: LearningStep[];
}
