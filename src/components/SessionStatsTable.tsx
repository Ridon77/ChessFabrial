import { getExerciseModeTable } from '../chess/sessionStatsAnalytics';
import { useLanguage } from '../i18n/useLanguage';
import type { SessionStats } from '../types/GameResult';

interface SessionStatsTableProps {
  stats: SessionStats;
}

function formatOptionalNumber(value: number | null, suffix = ''): string {
  if (value === null) {
    return '—';
  }
  return `${value}${suffix}`;
}

export function SessionStatsTable({ stats }: SessionStatsTableProps) {
  const { t, language } = useLanguage();
  const rows = getExerciseModeTable(stats, language);

  return (
    <section className="stats-table-panel" aria-labelledby="stats-table-title">
      <h3 id="stats-table-title" className="stats-summary-title">
        {t('stats.tableTitle')}
      </h3>
      <div className="stats-table-scroll">
        <table className="stats-table">
          <thead>
            <tr>
              <th scope="col">{t('stats.tableExercise')}</th>
              <th scope="col">{t('stats.tableMode')}</th>
              <th scope="col">{t('stats.tablePlayed')}</th>
              <th scope="col">{t('stats.tableWon')}</th>
              <th scope="col">{t('stats.tableDrawn')}</th>
              <th scope="col">{t('stats.tableLost')}</th>
              <th scope="col">{t('stats.tableAborted')}</th>
              <th scope="col">{t('stats.tableAvgMoves')}</th>
              <th scope="col">{t('stats.tableBestWin')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.exerciseType}-${row.mode}`}>
                <td>{row.exerciseLabel}</td>
                <td>{row.modeLabel}</td>
                <td>{row.played}</td>
                <td>{row.wins}</td>
                <td>{row.draws}</td>
                <td>{row.losses}</td>
                <td>{row.aborted}</td>
                <td>{formatOptionalNumber(row.avgMovesInWins)}</td>
                <td>{formatOptionalNumber(row.bestWinMoves)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
