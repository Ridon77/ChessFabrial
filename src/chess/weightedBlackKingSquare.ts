import type { Square } from 'chess.js';
import { shuffle } from './boardUtils';

/** Zona central — 40 % */
const ZONE_CENTRAL = ['d4', 'd5', 'e4', 'e5'] as const satisfies readonly Square[];

/** Zona semicentral — 30 % */
const ZONE_SEMICENTRAL = [
  'c3', 'c4', 'c5', 'c6',
  'd3', 'd6',
  'e3', 'e6',
  'f3', 'f4', 'f5', 'f6',
] as const satisfies readonly Square[];

/** Zona intermèdia — 20 % */
const ZONE_INTERMEDIATE = [
  'b2', 'b3', 'b4', 'b5', 'b6', 'b7',
  'c2', 'c7',
  'd2', 'd7',
  'e2', 'e7',
  'f2', 'f7',
  'g2', 'g3', 'g4', 'g5', 'g6', 'g7',
] as const satisfies readonly Square[];

/** Vores i cantonades — 10 % */
const ZONE_EDGE = [
  'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
  'b1', 'b8',
  'c1', 'c8',
  'd1', 'd8',
  'e1', 'e8',
  'f1', 'f8',
  'g1', 'g8',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
] as const satisfies readonly Square[];

const WEIGHTED_ZONES: readonly { squares: readonly Square[]; weight: number }[] = [
  { squares: ZONE_CENTRAL, weight: 40 },
  { squares: ZONE_SEMICENTRAL, weight: 30 },
  { squares: ZONE_INTERMEDIATE, weight: 20 },
  { squares: ZONE_EDGE, weight: 10 },
];

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickWeightedZone(): readonly Square[] {
  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const zone of WEIGHTED_ZONES) {
    cumulative += zone.weight;
    if (roll < cumulative) {
      return zone.squares;
    }
  }

  return ZONE_EDGE;
}

/**
 * Triar zona segons pes (40 / 30 / 20 / 10) i una casella aleatòria dins la zona.
 */
export function getWeightedBlackKingSquare(): Square {
  const zone = pickWeightedZone();
  return pickRandom(zone);
}

/** Casella aleatòria d'un conjunt (per al rei blanc i altres peces). */
export function pickRandomSquare(candidates: readonly string[]): string | null {
  if (candidates.length === 0) {
    return null;
  }
  return shuffle(candidates)[0];
}
