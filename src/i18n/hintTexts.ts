import type { ExerciseType } from '../types/ExerciseType';
import type { Language } from './types';

type HintPool = Record<ExerciseType, readonly string[]>;

const ATTACK: Record<Language, HintPool> = {
  ca: {
    KQK: [
      "Intenta reduir l'espai del rei negre amb la reina.",
      'Apropa el teu rei per donar suport a la reina.',
      "Evita l'ofegat: no tanquis totes les caselles del rei negre abans del mat.",
    ],
    KRK: [
      'Utilitza la torre per tallar files o columnes.',
      'Porta el rei negre cap a una vora del taulell.',
      "El teu rei ha d'ajudar la torre a controlar les caselles d'escapament.",
    ],
    KRRK: [
      'Utilitza les dues torres per tallar files i columnes.',
      "Una torre pot limitar el rei i l'altra pot preparar l'escac final.",
      'Evita donar escacs sense pla si permeten escapar al rei negre.',
    ],
    KBBK: [
      'Els dos alfils controlen diagonals de colors diferents.',
      "Fes servir el rei per anar reduint l'espai del rei negre.",
      'Porta el rei negre cap a una cantonada.',
      "No pots fer el mat només amb els alfils: el rei blanc ha d'ajudar.",
    ],
    KBNK: [
      "Aquest final és difícil: has de portar el rei negre a una cantonada del color de l'alfil.",
      "El cavall ajuda a treure caselles d'escapament.",
      'El rei blanc ha de participar activament.',
      'No portis el rei negre cap a la cantonada equivocada.',
    ],
    KNNK: [
      'Amb dos cavalls el mat no és forçable si el defensor juga perfecte.',
      'Busca coordinar els cavalls per treure caselles.',
      "El rei blanc ha d'ajudar molt.",
      "Intenta portar el rei negre cap a una cantonada, però vigila l'ofegat.",
    ],
  },
  es: {
    KQK: [
      'Intenta reducir el espacio del rey negro con la dama.',
      'Acerca tu rey para apoyar a la dama.',
      'Evita el ahogado: no cierres todas las casillas del rey negro antes del mate.',
    ],
    KRK: [
      'Usa la torre para cortar filas o columnas.',
      'Lleva el rey negro hacia un borde del tablero.',
      'Tu rey debe ayudar a la torre a controlar las casillas de escape.',
    ],
    KRRK: [
      'Usa las dos torres para cortar filas y columnas.',
      'Una torre puede limitar al rey y la otra preparar el jaque final.',
      'Evita dar jaques sin plan si permiten escapar al rey negro.',
    ],
    KBBK: [
      'Los dos alfiles controlan diagonales de colores distintos.',
      'Usa el rey para ir reduciendo el espacio del rey negro.',
      'Lleva el rey negro a una esquina.',
      'No puedes hacer mate solo con los alfiles: el rey blanco debe ayudar.',
    ],
    KBNK: [
      'Este final es difícil: debes llevar al rey negro a una esquina del color del alfil.',
      'El caballo ayuda a quitar casillas de escape.',
      'El rey blanco debe participar activamente.',
      'No lleves al rey negro a la esquina equivocada.',
    ],
    KNNK: [
      'Con dos caballos el mate no es forzable si el defensor juega perfecto.',
      'Busca coordinar los caballos para quitar casillas.',
      'El rey blanco debe ayudar mucho.',
      'Intenta llevar al rey negro a una esquina, pero cuidado con el ahogado.',
    ],
  },
  en: {
    KQK: [
      'Try to reduce the black king’s space with the queen.',
      'Bring your king closer to support the queen.',
      'Avoid stalemate: do not block every escape square before checkmate.',
    ],
    KRK: [
      'Use the rook to cut ranks or files.',
      'Drive the black king toward an edge of the board.',
      'Your king must help the rook control escape squares.',
    ],
    KRRK: [
      'Use both rooks to cut ranks and files.',
      'One rook can restrict the king while the other sets up the final check.',
      'Avoid pointless checks that let the black king escape.',
    ],
    KBBK: [
      'The two bishops control diagonals of different colors.',
      'Use your king to shrink the black king’s territory.',
      'Drive the black king toward a corner.',
      'You cannot mate with bishops alone: the white king must help.',
    ],
    KBNK: [
      'This ending is hard: drive the black king to a corner matching the bishop’s color.',
      'The knight helps remove escape squares.',
      'The white king must take an active part.',
      'Do not steer the black king to the wrong corner.',
    ],
    KNNK: [
      'With two knights, mate is not forceable against perfect defense.',
      'Coordinate the knights to remove squares.',
      'The white king must help a lot.',
      'Try to corner the black king, but watch for stalemate.',
    ],
  },
};

const DEFENSE_GENERIC: Record<Language, readonly string[]> = {
  ca: [
    'Busca caselles amb més mobilitat.',
    'Evita quedar contra la vora.',
    'Intenta acostar-te al centre.',
    "Busca possibilitats d'ofegat.",
    'Si tens torre, intenta donar escacs útils o canviar una torre.',
  ],
  es: [
    'Busca casillas con más movilidad.',
    'Evita quedar contra el borde.',
    'Intenta acercarte al centro.',
    'Busca posibilidades de ahogado.',
    'Si tienes torre, intenta dar jaques útiles o cambiar una torre.',
  ],
  en: [
    'Look for squares with more mobility.',
    'Avoid getting stuck on the edge.',
    'Try to move toward the center.',
    'Look for stalemate chances.',
    'If you have a rook, try useful checks or trading a rook.',
  ],
};

const DEFENSE_SPECIFIC: Record<Language, Partial<HintPool>> = {
  ca: {
    KQK: [
      'Busca caselles amb més mobilitat.',
      'Evita quedar contra la vora.',
      'Intenta acostar-te al centre.',
    ],
    KRK: [
      'Busca caselles amb més mobilitat.',
      'Evita quedar atrapat a la vora.',
      'Si pots, captura la torre blanca.',
    ],
    KRRK: [
      'Busca caselles amb més mobilitat.',
      'Evita quedar atrapat a la vora.',
      'Intenta mantenir-te prop del centre.',
    ],
    KBBK: [
      'Evita les cantonades.',
      'Busca caselles on tinguis més mobilitat.',
      "Allunya't del rei blanc quan puguis.",
    ],
    KBNK: [
      "Evita la cantonada del color de l'alfil.",
      'Busca mantenir-te prop del centre.',
      "Si et porten a una vora, intenta anar cap a la cantonada de color contrari a l'alfil.",
    ],
    KNNK: [
      'Evita les cantonades.',
      'Mantingues mobilitat.',
      "No ajudis l'atacant entrant voluntàriament en una xarxa de mat.",
    ],
  },
  es: {
    KQK: [
      'Busca casillas con más movilidad.',
      'Evita quedar contra el borde.',
      'Intenta acercarte al centro.',
    ],
    KRK: [
      'Busca casillas con más movilidad.',
      'Evita quedar atrapado en el borde.',
      'Si puedes, captura la torre blanca.',
    ],
    KRRK: [
      'Busca casillas con más movilidad.',
      'Evita quedar atrapado en el borde.',
      'Intenta mantenerte cerca del centro.',
    ],
    KBBK: [
      'Evita las esquinas.',
      'Busca casillas con más movilidad.',
      'Aléjate del rey blanco cuando puedas.',
    ],
    KBNK: [
      'Evita la esquina del color del alfil.',
      'Busca mantenerte cerca del centro.',
      'Si te llevan a un borde, intenta ir a la esquina de color contrario al alfil.',
    ],
    KNNK: [
      'Evita las esquinas.',
      'Mantén movilidad.',
      'No ayudes al atacante entrando en una red de mate.',
    ],
  },
  en: {
    KQK: [
      'Look for squares with more mobility.',
      'Avoid staying on the edge.',
      'Try to reach the center.',
    ],
    KRK: [
      'Look for squares with more mobility.',
      'Avoid getting trapped on the edge.',
      'If you can, capture the white rook.',
    ],
    KRRK: [
      'Look for squares with more mobility.',
      'Avoid getting trapped on the edge.',
      'Try to stay near the center.',
    ],
    KBBK: [
      'Avoid corners.',
      'Seek squares with more mobility.',
      'Stay away from the white king when you can.',
    ],
    KBNK: [
      'Avoid the corner matching the bishop’s color.',
      'Try to stay near the center.',
      'If pushed to an edge, head for the opposite-color corner.',
    ],
    KNNK: [
      'Avoid corners.',
      'Keep mobility.',
      'Do not help the attacker by walking into a mating net.',
    ],
  },
};

export function getAttackHints(
  lang: Language,
  exercise: ExerciseType,
): readonly string[] {
  return ATTACK[lang][exercise];
}

export function getDefenseHints(
  lang: Language,
  exercise: ExerciseType,
): readonly string[] {
  return DEFENSE_SPECIFIC[lang][exercise] ?? DEFENSE_GENERIC[lang];
}

export function getKbnkCornerHint(
  lang: Language,
  mode: 'attack' | 'defense',
  colorLabel: string,
): string {
  if (mode === 'attack') {
    const templates = {
      ca: 'Has de portar el rei negre a una cantonada de caselles {color}.',
      es: 'Debes llevar al rey negro a una esquina de casillas {color}.',
      en: 'Drive the black king to a corner of {color} squares.',
    };
    return templates[lang].replace('{color}', colorLabel);
  }

  const templates = {
    ca: "L'alfil blanc controla caselles {color}: evita aquesta cantonada.",
    es: 'El alfil blanco controla casillas {color}: evita esa esquina.',
    en: 'The white bishop controls {color} squares: avoid that corner.',
  };
  return templates[lang].replace('{color}', colorLabel);
}

export function getBishopColorLabel(
  lang: Language,
  color: 'light' | 'dark',
): string {
  const labels = {
    ca: { light: 'clares', dark: 'foses' },
    es: { light: 'claras', dark: 'oscuras' },
    en: { light: 'light', dark: 'dark' },
  };
  return labels[lang][color];
}
