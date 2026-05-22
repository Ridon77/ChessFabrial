import type { ExerciseDifficulty } from '../types/ExerciseType';
import type { ExerciseType } from '../types/ExerciseType';
import type { GameMode } from '../types/GameMode';
import type { Language } from './types';

export type TranslationKey = keyof typeof TRANSLATIONS.ca;

const TRANSLATIONS = {
  ca: {
    'app.title': "Finals d'escac i mat",
    'app.subtitle': 'Practica finals bàsics amb posicions aleatòries legals.',
    'lang.select': 'Idioma',

    'home.title': 'Tria un final per practicar',
    'home.intro':
      'Cada exercici genera una posició aleatòria legal. Juga amb blanques (atac).',
    'home.vs': 'vs',
    'home.matePrefix': 'Mat:',
    'home.comingSoon': 'Properament',
    'home.modeAttack': 'Mode atac',
    'home.statsSection': 'Resum de la sessió',

    'exercise.label.KQK': 'Rei + Reina contra Rei',
    'exercise.label.KRK': 'Rei + Torre contra Rei',
    'exercise.label.KRRK': 'Rei + dues torres contra Rei',
    'exercise.label.KBBK': 'Rei + dos alfils contra Rei',
    'exercise.label.KBNK': 'Rei + alfil + cavall contra Rei',
    'exercise.label.KNNK': 'Rei + dos cavalls contra Rei',

    'exercise.readme.KQK': 'Rei + Dama contra Rei',
    'exercise.readme.KRK': 'Rei + Torre contra Rei',
    'exercise.readme.KRRK': 'Rei + dues Torres contra Rei',
    'exercise.readme.KBBK': 'Rei + dos Alfils contra Rei',
    'exercise.readme.KBNK': 'Rei + Alfil + Cavall contra Rei',
    'exercise.readme.KNNK': 'Rei + dos Cavalls contra Rei',

    'exercise.topic.KQK': 'reina',
    'exercise.topic.KRK': 'torre',
    'exercise.topic.KRRK': 'dues torres',
    'exercise.topic.KBBK': 'dos alfils',
    'exercise.topic.KBNK': 'alfil i cavall',
    'exercise.topic.KNNK': 'dos cavalls',

    'difficulty.easy': 'Fàcil',
    'difficulty.basic': 'Bàsic',
    'difficulty.advanced': 'Avançat',
    'difficulty.expert': 'Molt avançat',
    'difficulty.special': 'Especial',

    'mate.yes': 'Sí',
    'mate.noKNNK': 'No, contra defensa perfecta',
    'mate.special': 'Mode especial',

    'gameMode.attack': 'Mode atac',
    'gameMode.defense': 'Mode defensa',
    'gameMode.short.attack': 'Atac',
    'gameMode.short.defense': 'Defensa',

    'side.white': 'Blanques',
    'side.black': 'Negres',
    'side.attackHint': '(atac)',
    'side.defenseHint': '(defensa)',

    'board.aria': "Taulell d'escacs",
    'board.loading': 'Carregant taulell…',

    'gameStatus.title': "Estat de l'exercici",
    'gameStatus.final': 'Final',
    'gameStatus.difficulty': 'Dificultat',
    'gameStatus.forcedMate': 'Mat forçat',
    'gameStatus.mode': 'Mode',
    'gameStatus.side': 'Bàndol',
    'gameStatus.objective': 'Objectiu',
    'gameStatus.turn': 'Torn',
    'gameStatus.moves': 'Jugades',
    'gameStatus.idle': 'Selecciona un exercici i comença.',
    'gameStatus.turnMachine': 'Torn de la màquina.',
    'gameStatus.turnPlayer': 'Torn del jugador.',
    'gameStatus.checkOwn': 'El teu rei està en escac.',
    'gameStatus.checkBlack': 'El rei negre està en escac.',
    'gameStatus.winSpecial':
      'Mat aconseguit! En aquest final el mat no és forçable: el defensor ha errat.',
    'gameStatus.winCheckmate': 'Escac i mat! Exercici completat.',
    'gameStatus.lossCheckmate': 'Escac i mat. La màquina ha guanyat.',
    'gameStatus.stalemate': 'Ofegat. La partida acaba en taules.',
    'gameStatus.draw': 'Taules.',
    'gameStatus.drawWithReason': 'Taules: {reason}.',
    'gameStatus.feedbackIllegal': 'Jugada il·legal.',
    'gameStatus.feedbackNewPosition': 'Nova posició generada.',
    'gameStatus.roleKNNKWhite':
      'Practica coordinació: el mat existeix però no és forçable.',
    'gameStatus.roleKNNKBlack': 'Les negres busquen resistir o ofegat.',
    'gameStatus.roleWhite': 'Les blanques busquen el mat.',
    'gameStatus.roleBlack': 'Les negres intenten resistir.',
    'gameStatus.newPosition': 'Nova posició',
    'gameStatus.restart': 'Reiniciar exercici',

    'hints.title': 'Pistes',
    'hints.topic': 'Consells per a final de {topic} {mode}.',
    'hints.show': 'Mostrar una pista',
    'hints.label': 'Pista:',

    'result.win': 'Victòria',
    'result.draw': 'Empat',
    'result.loss': 'Derrota',
    'result.exercise': 'Exercici',
    'result.mode': 'Mode',
    'result.moves': 'Jugades',
    'result.replay': 'Rejugar',
    'result.viewBoard': 'Veure el taulell',
    'result.goHome': "Anar a l'inici",
    'result.winSpecial':
      'Has fet mat. En aquest final el defensor ha errat.',
    'result.winCheckmate': "Escac i mat. Has completat l'exercici.",
    'result.winGeneric': 'Bon resultat en aquesta partida.',
    'result.drawStalemate': 'Ofegat. La partida acaba en taules.',
    'result.drawWithReason': 'Taules: {reason}.',
    'result.drawGeneric': 'La partida ha acabat en taules.',
    'result.lossCheckmate':
      'Escac i mat. La màquina ha guanyat aquesta partida.',

    'draw.insufficientMaterial': 'Material insuficient',

    'boardActions.abort': 'Abortar partida',
    'boardActions.goHome': "Anar a l'inici",

    'stats.aria': 'Estadístiques de sessió',
    'stats.title': 'Estadístiques de la sessió',
    'stats.empty': 'Encara no hi ha partides registrades aquesta sessió.',
    'stats.played': 'Partides jugades:',
    'stats.wins': 'Victòries',
    'stats.draws': 'Taules',
    'stats.losses': 'Derrotes',
    'stats.aborted': 'Avortades',
    'stats.homeEmpty': 'Encara no has jugat cap partida en aquesta sessió.',
    'stats.homeAria': 'Resum de sessió',
    'stats.chartTitle': 'Resultats per mode',
    'stats.chartEmpty': 'Cap partida en aquest mode.',
    'stats.chartWon': 'Guanyades',
    'stats.chartDrawn': 'Empatades',
    'stats.chartLost': 'Perdudes',
    'stats.chartAborted': 'Avortades',
    'stats.tableTitle': 'Taula comparativa',
    'stats.tableExercise': 'Exercici',
    'stats.tableMode': 'Mode',
    'stats.tablePlayed': 'Partides',
    'stats.tableWon': 'Guanyades',
    'stats.tableDrawn': 'Empatades',
    'stats.tableLost': 'Perdudes',
    'stats.tableAborted': 'Avortades',
    'stats.tableAvgMoves': 'Mitj. jugades (victòries)',
    'stats.tableBestWin': 'Millor victòria (jugades)',

    'playerSide.legend': 'Bàndol del jugador',
    'playerSide.help':
      'Les blanques atacen (busquen el mat). Les negres defensen.',
    'playerSide.white': 'Blanques',
    'playerSide.black': 'Negres',

    'exerciseSelect.legend': 'Exercici',
    'exerciseSelect.knnkNotice':
      "Aquest final és especial: el mat existeix, però no es pot forçar contra una defensa correcta.",
    'exerciseSelect.prepared': 'Preparat',
    'exerciseSelect.comingSoon': 'Properament',
  },
  es: {
    'app.title': 'Finales de jaque mate',
    'app.subtitle':
      'Practica finales básicos con posiciones aleatorias legales.',
    'lang.select': 'Idioma',

    'home.title': 'Elige un final para practicar',
    'home.intro':
      'Cada ejercicio genera una posición aleatoria legal. Juega con blancas (ataque).',
    'home.vs': 'vs',
    'home.matePrefix': 'Mate:',
    'home.comingSoon': 'Próximamente',
    'home.modeAttack': 'Modo ataque',
    'home.statsSection': 'Resumen de la sesión',

    'exercise.label.KQK': 'Rey + Dama contra Rey',
    'exercise.label.KRK': 'Rey + Torre contra Rey',
    'exercise.label.KRRK': 'Rey + dos torres contra Rey',
    'exercise.label.KBBK': 'Rey + dos alfiles contra Rey',
    'exercise.label.KBNK': 'Rey + alfil + caballo contra Rey',
    'exercise.label.KNNK': 'Rey + dos caballos contra Rey',

    'exercise.readme.KQK': 'Rey + Dama contra Rey',
    'exercise.readme.KRK': 'Rey + Torre contra Rey',
    'exercise.readme.KRRK': 'Rey + dos Torres contra Rey',
    'exercise.readme.KBBK': 'Rey + dos Alfiles contra Rey',
    'exercise.readme.KBNK': 'Rey + Alfil + Caballo contra Rey',
    'exercise.readme.KNNK': 'Rey + dos Caballos contra Rey',

    'exercise.topic.KQK': 'dama',
    'exercise.topic.KRK': 'torre',
    'exercise.topic.KRRK': 'dos torres',
    'exercise.topic.KBBK': 'dos alfiles',
    'exercise.topic.KBNK': 'alfil y caballo',
    'exercise.topic.KNNK': 'dos caballos',

    'difficulty.easy': 'Fácil',
    'difficulty.basic': 'Básico',
    'difficulty.advanced': 'Avanzado',
    'difficulty.expert': 'Muy avanzado',
    'difficulty.special': 'Especial',

    'mate.yes': 'Sí',
    'mate.noKNNK': 'No, contra defensa perfecta',
    'mate.special': 'Modo especial',

    'gameMode.attack': 'Modo ataque',
    'gameMode.defense': 'Modo defensa',
    'gameMode.short.attack': 'Ataque',
    'gameMode.short.defense': 'Defensa',

    'side.white': 'Blancas',
    'side.black': 'Negras',
    'side.attackHint': '(ataque)',
    'side.defenseHint': '(defensa)',

    'board.aria': 'Tablero de ajedrez',
    'board.loading': 'Cargando tablero…',

    'gameStatus.title': 'Estado del ejercicio',
    'gameStatus.final': 'Final',
    'gameStatus.difficulty': 'Dificultad',
    'gameStatus.forcedMate': 'Mate forzado',
    'gameStatus.mode': 'Modo',
    'gameStatus.side': 'Band',
    'gameStatus.objective': 'Objetivo',
    'gameStatus.turn': 'Turno',
    'gameStatus.moves': 'Jugadas',
    'gameStatus.idle': 'Selecciona un ejercicio y comienza.',
    'gameStatus.turnMachine': 'Turno de la máquina.',
    'gameStatus.turnPlayer': 'Turno del jugador.',
    'gameStatus.checkOwn': 'Tu rey está en jaque.',
    'gameStatus.checkBlack': 'El rey negro está en jaque.',
    'gameStatus.winSpecial':
      '¡Mate conseguido! En este final el mate no es forzable: el defensor ha fallado.',
    'gameStatus.winCheckmate': '¡Jaque mate! Ejercicio completado.',
    'gameStatus.lossCheckmate': 'Jaque mate. La máquina ha ganado.',
    'gameStatus.stalemate': 'Ahogado. La partida termina en tablas.',
    'gameStatus.draw': 'Tablas.',
    'gameStatus.drawWithReason': 'Tablas: {reason}.',
    'gameStatus.feedbackIllegal': 'Jugada ilegal.',
    'gameStatus.feedbackNewPosition': 'Nueva posición generada.',
    'gameStatus.roleKNNKWhite':
      'Practica coordinación: el mate existe pero no es forzable.',
    'gameStatus.roleKNNKBlack': 'Las negras buscan resistir o ahogado.',
    'gameStatus.roleWhite': 'Las blancas buscan el mate.',
    'gameStatus.roleBlack': 'Las negras intentan resistir.',
    'gameStatus.newPosition': 'Nueva posición',
    'gameStatus.restart': 'Reiniciar ejercicio',

    'hints.title': 'Pistas',
    'hints.topic': 'Consejos para final de {topic} {mode}.',
    'hints.show': 'Mostrar una pista',
    'hints.label': 'Pista:',

    'result.win': 'Victoria',
    'result.draw': 'Empate',
    'result.loss': 'Derrota',
    'result.exercise': 'Ejercicio',
    'result.mode': 'Modo',
    'result.moves': 'Jugadas',
    'result.replay': 'Repetir',
    'result.viewBoard': 'Ver el tablero',
    'result.goHome': 'Ir al inicio',
    'result.winSpecial':
      'Has hecho mate. En este final el defensor ha fallado.',
    'result.winCheckmate': 'Jaque mate. Has completado el ejercicio.',
    'result.winGeneric': 'Buen resultado en esta partida.',
    'result.drawStalemate': 'Ahogado. La partida acaba en tablas.',
    'result.drawWithReason': 'Tablas: {reason}.',
    'result.drawGeneric': 'La partida ha acabado en tablas.',
    'result.lossCheckmate':
      'Jaque mate. La máquina ha ganado esta partida.',

    'draw.insufficientMaterial': 'Material insuficiente',

    'boardActions.abort': 'Abortar partida',
    'boardActions.goHome': 'Ir al inicio',

    'stats.aria': 'Estadísticas de sesión',
    'stats.title': 'Estadísticas de la sesión',
    'stats.empty': 'Aún no hay partidas registradas en esta sesión.',
    'stats.played': 'Partidas jugadas:',
    'stats.wins': 'Victorias',
    'stats.draws': 'Empates',
    'stats.losses': 'Derrotas',
    'stats.aborted': 'Abortadas',
    'stats.homeEmpty': 'Aún no has jugado ninguna partida en esta sesión.',
    'stats.homeAria': 'Resumen de sesión',
    'stats.chartTitle': 'Resultados por modo',
    'stats.chartEmpty': 'Ninguna partida en este modo.',
    'stats.chartWon': 'Ganadas',
    'stats.chartDrawn': 'Empatadas',
    'stats.chartLost': 'Perdidas',
    'stats.chartAborted': 'Abortadas',
    'stats.tableTitle': 'Tabla comparativa',
    'stats.tableExercise': 'Ejercicio',
    'stats.tableMode': 'Modo',
    'stats.tablePlayed': 'Partidas',
    'stats.tableWon': 'Ganadas',
    'stats.tableDrawn': 'Empatadas',
    'stats.tableLost': 'Perdidas',
    'stats.tableAborted': 'Abortadas',
    'stats.tableAvgMoves': 'Media jugadas (victorias)',
    'stats.tableBestWin': 'Mejor victoria (jugadas)',

    'playerSide.legend': 'Band del jugador',
    'playerSide.help':
      'Las blancas atacan (buscan el mate). Las negras defienden.',
    'playerSide.white': 'Blancas',
    'playerSide.black': 'Negras',

    'exerciseSelect.legend': 'Ejercicio',
    'exerciseSelect.knnkNotice':
      'Este final es especial: el mate existe, pero no se puede forzar contra una defensa correcta.',
    'exerciseSelect.prepared': 'Preparado',
    'exerciseSelect.comingSoon': 'Próximamente',
  },
  en: {
    'app.title': 'Checkmate Endgames',
    'app.subtitle':
      'Practice basic endgames with random legal positions.',
    'lang.select': 'Language',

    'home.title': 'Choose an endgame to practice',
    'home.intro':
      'Each exercise generates a random legal position. You play White (attack).',
    'home.vs': 'vs',
    'home.matePrefix': 'Mate:',
    'home.comingSoon': 'Coming soon',
    'home.modeAttack': 'Attack mode',
    'home.statsSection': 'Session summary',

    'exercise.label.KQK': 'King + Queen vs King',
    'exercise.label.KRK': 'King + Rook vs King',
    'exercise.label.KRRK': 'King + two rooks vs King',
    'exercise.label.KBBK': 'King + two bishops vs King',
    'exercise.label.KBNK': 'King + bishop + knight vs King',
    'exercise.label.KNNK': 'King + two knights vs King',

    'exercise.readme.KQK': 'King + Queen vs King',
    'exercise.readme.KRK': 'King + Rook vs King',
    'exercise.readme.KRRK': 'King + two Rooks vs King',
    'exercise.readme.KBBK': 'King + two Bishops vs King',
    'exercise.readme.KBNK': 'King + Bishop + Knight vs King',
    'exercise.readme.KNNK': 'King + two Knights vs King',

    'exercise.topic.KQK': 'queen',
    'exercise.topic.KRK': 'rook',
    'exercise.topic.KRRK': 'two rooks',
    'exercise.topic.KBBK': 'two bishops',
    'exercise.topic.KBNK': 'bishop and knight',
    'exercise.topic.KNNK': 'two knights',

    'difficulty.easy': 'Easy',
    'difficulty.basic': 'Basic',
    'difficulty.advanced': 'Advanced',
    'difficulty.expert': 'Expert',
    'difficulty.special': 'Special',

    'mate.yes': 'Yes',
    'mate.noKNNK': 'No, against perfect defense',
    'mate.special': 'Special mode',

    'gameMode.attack': 'Attack mode',
    'gameMode.defense': 'Defense mode',
    'gameMode.short.attack': 'Attack',
    'gameMode.short.defense': 'Defense',

    'side.white': 'White',
    'side.black': 'Black',
    'side.attackHint': '(attack)',
    'side.defenseHint': '(defense)',

    'board.aria': 'Chess board',
    'board.loading': 'Loading board…',

    'gameStatus.title': 'Exercise status',
    'gameStatus.final': 'Endgame',
    'gameStatus.difficulty': 'Difficulty',
    'gameStatus.forcedMate': 'Forced mate',
    'gameStatus.mode': 'Mode',
    'gameStatus.side': 'Side',
    'gameStatus.objective': 'Objective',
    'gameStatus.turn': 'Turn',
    'gameStatus.moves': 'Moves',
    'gameStatus.idle': 'Select an exercise and start.',
    'gameStatus.turnMachine': "Machine's turn.",
    'gameStatus.turnPlayer': "Player's turn.",
    'gameStatus.checkOwn': 'Your king is in check.',
    'gameStatus.checkBlack': 'The black king is in check.',
    'gameStatus.winSpecial':
      'Checkmate! In this endgame mate is not forceable: the defender blundered.',
    'gameStatus.winCheckmate': 'Checkmate! Exercise completed.',
    'gameStatus.lossCheckmate': 'Checkmate. The machine won.',
    'gameStatus.stalemate': 'Stalemate. The game is drawn.',
    'gameStatus.draw': 'Draw.',
    'gameStatus.drawWithReason': 'Draw: {reason}.',
    'gameStatus.feedbackIllegal': 'Illegal move.',
    'gameStatus.feedbackNewPosition': 'New position generated.',
    'gameStatus.roleKNNKWhite':
      'Practice coordination: mate exists but is not forceable.',
    'gameStatus.roleKNNKBlack': 'Black seeks to hold or stalemate.',
    'gameStatus.roleWhite': 'White seeks checkmate.',
    'gameStatus.roleBlack': 'Black tries to resist.',
    'gameStatus.newPosition': 'New position',
    'gameStatus.restart': 'Restart exercise',

    'hints.title': 'Hints',
    'hints.topic': 'Tips for {topic} endgame {mode}.',
    'hints.show': 'Show a hint',
    'hints.label': 'Hint:',

    'result.win': 'Victory',
    'result.draw': 'Draw',
    'result.loss': 'Defeat',
    'result.exercise': 'Exercise',
    'result.mode': 'Mode',
    'result.moves': 'Moves',
    'result.replay': 'Play again',
    'result.viewBoard': 'View board',
    'result.goHome': 'Go to home',
    'result.winSpecial':
      'You delivered mate. In this endgame the defender blundered.',
    'result.winCheckmate': 'Checkmate. You completed the exercise.',
    'result.winGeneric': 'Good result in this game.',
    'result.drawStalemate': 'Stalemate. The game is drawn.',
    'result.drawWithReason': 'Draw: {reason}.',
    'result.drawGeneric': 'The game ended in a draw.',
    'result.lossCheckmate': 'Checkmate. The machine won this game.',

    'draw.insufficientMaterial': 'Insufficient material',

    'boardActions.abort': 'Abort game',
    'boardActions.goHome': 'Go to home',

    'stats.aria': 'Session statistics',
    'stats.title': 'Session statistics',
    'stats.empty': 'No games recorded yet this session.',
    'stats.played': 'Games played:',
    'stats.wins': 'Wins',
    'stats.draws': 'Draws',
    'stats.losses': 'Losses',
    'stats.aborted': 'Aborted',
    'stats.homeEmpty': 'You have not played any games this session yet.',
    'stats.homeAria': 'Session summary',
    'stats.chartTitle': 'Results by mode',
    'stats.chartEmpty': 'No games in this mode.',
    'stats.chartWon': 'Won',
    'stats.chartDrawn': 'Drawn',
    'stats.chartLost': 'Lost',
    'stats.chartAborted': 'Aborted',
    'stats.tableTitle': 'Comparison table',
    'stats.tableExercise': 'Exercise',
    'stats.tableMode': 'Mode',
    'stats.tablePlayed': 'Games',
    'stats.tableWon': 'Won',
    'stats.tableDrawn': 'Drawn',
    'stats.tableLost': 'Lost',
    'stats.tableAborted': 'Aborted',
    'stats.tableAvgMoves': 'Avg. moves (wins)',
    'stats.tableBestWin': 'Best win (moves)',

    'playerSide.legend': 'Player side',
    'playerSide.help':
      'White attacks (seeks mate). Black defends.',
    'playerSide.white': 'White',
    'playerSide.black': 'Black',

    'exerciseSelect.legend': 'Exercise',
    'exerciseSelect.knnkNotice':
      'This endgame is special: mate exists but cannot be forced against correct defense.',
    'exerciseSelect.prepared': 'Ready',
    'exerciseSelect.comingSoon': 'Coming soon',
  },
} as const satisfies Record<Language, Record<string, string>>;

export function translate(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const table = TRANSLATIONS[lang];
  let text: string = table[key] ?? TRANSLATIONS.ca[key] ?? key;

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }

  return text;
}

export function exerciseLabelKey(exercise: ExerciseType): TranslationKey {
  return `exercise.label.${exercise}` as TranslationKey;
}

export function exerciseReadmeKey(exercise: ExerciseType): TranslationKey {
  return `exercise.readme.${exercise}` as TranslationKey;
}

export function exerciseTopicKey(exercise: ExerciseType): TranslationKey {
  return `exercise.topic.${exercise}` as TranslationKey;
}

export function difficultyKey(
  difficulty: ExerciseDifficulty,
): TranslationKey {
  return `difficulty.${difficulty}` as TranslationKey;
}

export function gameModeKey(mode: GameMode): TranslationKey {
  return `gameMode.${mode}` as TranslationKey;
}

export function gameModeShortKey(mode: GameMode): TranslationKey {
  return `gameMode.short.${mode}` as TranslationKey;
}

export function translateDrawReason(
  lang: Language,
  reason: string | null,
): string | null {
  if (!reason) {
    return null;
  }
  if (reason === 'Material insuficient') {
    return translate(lang, 'draw.insufficientMaterial');
  }
  return reason;
}

export function getMateLabel(
  lang: Language,
  exercise: ExerciseType,
  isSpecial: boolean,
  forceableMate: boolean,
): string {
  if (exercise === 'KNNK') {
    return translate(lang, 'mate.noKNNK');
  }
  if (isSpecial || !forceableMate) {
    return translate(lang, 'mate.special');
  }
  return translate(lang, 'mate.yes');
}
