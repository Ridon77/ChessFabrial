# Finals d'escac i mat

Aplicació web estàtica per practicar finals bàsics d'escac i mat amb posicions inicials aleatòries i legals.

## Objectiu

Permet entrenar la tècnica de mat en finals reduïts sense necessitat de backend ni compte d'usuari. Cada sessió genera una posició nova; el jugador practica com a atacant (blanques) davant d'una màquina amb **heurística simple** (no és un motor perfecte).

## Finals disponibles

Catàleg definit a `src/types/ExerciseType.ts` (`EXERCISE_DEFINITIONS`). Pistes a `src/chess/hints.ts`.

| Codi | Final | Dificultat | Mat forçat |
|------|-------|------------|------------|
| KQK | Rei + Dama contra Rei | Fàcil | Sí |
| KRK | Rei + Torre contra Rei | Bàsic | Sí |
| KRRK | Rei + dues Torres contra Rei | Fàcil | Sí |
| KBBK | Rei + dos Alfils contra Rei | Avançat | Sí |
| KBNK | Rei + Alfil + Cavall contra Rei | Molt avançat | Sí |
| KNNK | Rei + dos Cavalls contra Rei | Especial | No, contra defensa perfecta |

### Final especial KNNK

**KNNK** no és un final de mat forçat. El mat existeix en algunes posicions, però **no es pot forçar** contra una defensa correcta. L'aplicació el presenta com a mode **especial i didàctic**: avís al selector, etiqueta «Mat forçat: No, contra defensa perfecta» a l'estat de l'exercici, i missatges adaptats si es produeix mat.

## Modes d'entrenament

- **Mode atac:** el jugador juga amb **blanques** i intenta fer mat. *(visible per defecte)*
- **Mode defensa:** el jugador juga amb **negres** i intenta resistir. *(ocult a la UI; codi i pistes conservats)*

Per activar el mode defensa, edita `src/config/featureFlags.ts`:

```ts
export const FEATURE_FLAGS = {
  showDefenseMode: true,
} as const;
```

### Regla important

- Les **blanques** sempre són el bàndol atacant.
- Les **negres** sempre són el defensor.
- El taulell i la màquina mantenen aquesta lògica encara que el jugador controli les negres en mode defensa.

## Flux d'usuari

1. Pantalla d'**inici** amb selector d'idioma (català, castellà, anglès) a la part superior dreta.
2. **Sis botons** grans per triar el final (mode atac amb blanques; el mode defensa es pot activar via `featureFlags`).
3. Si ja s'ha jugat, es mostren **estadístiques de sessió** (resum, gràfic per mode, taula comparativa).
4. En obrir un exercici: taulell, estat, pistes i estadístiques compactes a la barra lateral.
5. **Moviment per clics** amb punts de destinació legals (`public/markers/move-dot.png`); també es pot arrossegar.
6. El **rei en escac** o en **mat** canvia d'imatge (`king-*-m.png`, `king-*-cm.png`; el mat té prioritat sobre l'escac).
7. En acabar la partida: **pop-up** amb resultat (Rejugar, Veure el taulell, Anar a l'inici).
8. **Abortar partida** o tornar a l'inici des del taulell; les avortades es registren com a `aborted`.
9. Les estadístiques s'actualitzen en tornar a l'inici (només en memòria de sessió).

## Interfície didàctica

- **GameStatus:** nom del final, dificultat, mat forçat, mode, objectiu, torn i resultat.
- **HintBox:** pistes per final i mode; en KBNK, pista del color de l'alfil segons la posició.
- **Estadístiques de sessió:** victòries, taules, derrotes i avortades (sense backend). L'idioma es guarda a `localStorage`; les partides no.
- **i18n:** textos a `src/i18n/translations.ts` (`ca`, `es`, `en`).

## Tecnologies

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [chess.js](https://github.com/jhlywa/chess.js) — regles i validació de moviments
- [react-chessboard](https://github.com/Clariity/react-chessboard) — taulell visual

## Requisits

- Node.js 20 o superior
- npm

## Instal·lació

```bash
npm install
```

## Execució local

```bash
npm run dev
```

Obre l'URL que mostra la terminal (normalment `http://localhost:5173/`).

## Build de producció

```bash
npm run build
```

Es genera la carpeta `dist/` amb HTML, JavaScript, CSS i les imatges de peces.

## Previsualització de producció

```bash
npm run preview
```

Serveix el contingut de `dist/` per comprovar el build abans de publicar-lo.

## Desplegament

1. Executa `npm run build`.
2. Puja **tot el contingut** de la carpeta `dist/` al servidor o servei d'allotjament estàtic:
   - Arrel del domini (`public_html/`, `www/`, etc.)
   - [GitHub Pages](https://pages.github.com/), [Netlify](https://www.netlify.com/) o [Vercel](https://vercel.com/)

No cal Node.js al servidor: només fitxers estàtics.

### Desplegar en una subcarpeta

Si l'aplicació viurà sota una subcarpeta (per exemple `https://exemple.org/escacs/`):

1. Copia `.env.example` a `.env` i defineix `VITE_BASE_PATH=/escacs/`, o executa:

```bash
npm run build:subdir
```

2. Puja el contingut de `dist/` dins la subcarpeta corresponent.

3. Prova en local:

```bash
npm run preview:subdir
```

## Peces personalitzades

Les imatges PNG han d'estar a `public/pieces/`:

```
public/pieces/
  white-king.png
  white-queen.png
  white-rook.png
  white-bishop.png
  white-knight.png
  black-king.png
```

Cada final usa només les peces necessàries; les dues torres o els dos cavalls reutilitzen la mateixa imatge.

### Reis en escac i mat (taulell)

A `public/pieces/`:

- `king-white-m.png`, `king-black-m.png` — rei en escac
- `king-white-cm.png`, `king-black-cm.png` — rei en escac i mat (prioritat visual sobre escac)

Còpies de referència també a `public/ui/`. Vegeu `src/chess/kingVisuals.ts`.

### Marcadors de moviment

- `public/markers/move-dot.png` — destinacions legals en clicar una peça

## Estructura de carpetes

```
src/
  components/     Interfície (inici, taulell, modal, estadístiques, idioma)
  chess/          Lògica d'escacs (posicions, validació, màquina, pistes)
  i18n/           Traduccions i context d'idioma
  config/         Feature flags i implementació per exercici
  types/          Tipus TypeScript i catàleg de finals
public/
  pieces/         Imatges PNG de les peces i reis especials
  markers/        Punt de destinació legal
```

## Scripts disponibles

| Script | Descripció |
|--------|------------|
| `npm run dev` | Servidor de desenvolupament |
| `npm run build` | Build per arrel del domini (`/`) |
| `npm run build:subdir` | Build d'exemple per subcarpeta `/escacs/` |
| `npm run preview` | Previsualitza `dist/` |
| `npm run preview:subdir` | Previsualitza amb base `/escacs/` |
| `npm run lint` | Comprovació ESLint |

## Limitacions actuals

- No és multijugador.
- **No utilitza Stockfish** ni cap motor extern.
- No té backend, base de dades ni autenticació; les estadístiques només duren la sessió del navegador (sense persistència).
- La **IA és heurística**: prioritza moviments legals i coherents, no calcula la millor jugada.
- Els finals **avançats** (KBBK, KBNK, KNNK) i fins i tot alguns bàsics poden no jugar-se de manera perfecta.
- **KBNK** és especialment difícil: la màquina aproxima el mat per cantonada del color de l'alfil, però pot errar en variants llargues.
- **KNNK** no és un mat forçable contra defensa perfecta; la màquina no està dissenyada per trobar mat sistemàticament.
- Les pistes són textos fixos (amb pista contextual del color de l'alfil en KBNK); no suggereixen una jugada concreta.

## Millores futures

- Millor motor de recomanació i pistes contextuals.
- Persistència opcional d'estadístiques (sense servidor).
- Mode defensa visible al menú d'inici (`showDefenseMode: true`).

## Llicència

Projecte privat d'ús educatiu. Ajusta la llicència segons les necessitats del repositori.
