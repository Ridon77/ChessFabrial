import {
  createGame,
  getMachineSide,
  isPlayerTurn,
  snapshotFromFen,
  type GameSnapshot,
} from './gameState';
import { applyMove } from './moveValidation';
import { machineMove } from './machineMove';
import type { ExerciseType } from '../types/ExerciseType';
import type { PlayerSide } from '../types/PlayerSide';

export interface GameSessionContext {
  exercise: ExerciseType;
  playerSide: PlayerSide;
}

export interface PlayerMoveInput extends GameSessionContext {
  fen: string;
  from: string;
  to: string;
}

export interface FlowResult {
  snapshot: GameSnapshot;
}

/** Espera abans que la màquina respongui després d'una jugada del jugador (Prompt 31). */
export const MACHINE_THINKING_DELAY_MS = 500;

function runMachineTurn(
  fen: string,
  exercise: ExerciseType,
  playerSide: PlayerSide,
): GameSnapshot {
  const machineSide = getMachineSide(playerSide);
  const machineFen = machineMove({ fen, exercise, machineSide });

  if (!machineFen) {
    return snapshotFromFen(fen);
  }

  return snapshotFromFen(machineFen);
}

/** Només el moviment del jugador (sense resposta immediata de la màquina). */
export function applyPlayerMoveOnly({
  fen,
  from,
  to,
  playerSide,
}: Omit<PlayerMoveInput, 'exercise'>): FlowResult | null {
  const game = createGame(fen);

  if (!isPlayerTurn(game, playerSide)) {
    return null;
  }

  const afterPlayerFen = applyMove(fen, from, to);
  if (!afterPlayerFen) {
    return null;
  }

  return { snapshot: snapshotFromFen(afterPlayerFen) };
}

/** Cal programar el torn de la màquina després de la jugada del jugador? */
export function shouldScheduleMachineMove(
  snapshot: GameSnapshot,
  playerSide: PlayerSide,
): boolean {
  if (snapshot.status !== 'playing') {
    return false;
  }
  return !isPlayerTurn(createGame(snapshot.fen), playerSide);
}

/** Executa el moviment de la màquina sobre el FEN actual. */
export function applyMachineTurn(
  fen: string,
  exercise: ExerciseType,
  playerSide: PlayerSide,
): GameSnapshot {
  return runMachineTurn(fen, exercise, playerSide);
}

/** Aplica el moviment del jugador i, si cal, la resposta de la màquina (sense delay). */
export function processPlayerMove({
  fen,
  from,
  to,
  exercise,
  playerSide,
}: PlayerMoveInput): FlowResult | null {
  const result = applyPlayerMoveOnly({ fen, from, to, playerSide });
  if (!result) {
    return null;
  }

  let snapshot = result.snapshot;
  if (shouldScheduleMachineMove(snapshot, playerSide)) {
    snapshot = runMachineTurn(snapshot.fen, exercise, playerSide);
  }

  return { snapshot };
}

/** Inicia o repren el torn de la màquina si és el primer a moure (jugador negres). */
export function applyInitialMachineTurn(
  fen: string,
  exercise: ExerciseType,
  playerSide: PlayerSide,
): FlowResult {
  let snapshot = snapshotFromFen(fen);

  if (
    snapshot.status === 'playing' &&
    !isPlayerTurn(createGame(snapshot.fen), playerSide)
  ) {
    snapshot = runMachineTurn(snapshot.fen, exercise, playerSide);
  }

  return { snapshot };
}

export function isBoardPlayable(
  snapshot: GameSnapshot,
  playerSide: PlayerSide,
): boolean {
  if (snapshot.status !== 'playing') {
    return false;
  }
  return isPlayerTurn(createGame(snapshot.fen), playerSide);
}

export { getMachineSide };
