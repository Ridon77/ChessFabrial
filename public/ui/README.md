# Recursos visuals (UI)

Còpies de referència dels reis en escac i mat. Les imatges **actives al taulell** estan a `public/pieces/` amb els noms:

| Fitxer a `pieces/` | Ús |
|--------------------|-----|
| `king-white-m.png` | Rei blanc en escac |
| `king-black-m.png` | Rei negre en escac |
| `king-white-cm.png` | Rei blanc en escac i mat |
| `king-black-cm.png` | Rei negre en escac i mat |

Lògica: `src/chess/kingVisuals.ts` (el mat té prioritat sobre l'escac).

Els fitxers d'aquesta carpeta (`king-*-checkmate.png`, `king-*-mate.png`) es poden usar com a origen per regenerar les versions de `pieces/`.
