import { summarizeSessionStats } from '../chess/sessionStats';
import { useLanguage } from '../i18n/useLanguage';
import type { SessionStats } from '../types/GameResult';

interface SessionStatsPanelProps {
  stats: SessionStats;
  compact?: boolean;
}

export function SessionStatsPanel({ stats, compact = false }: SessionStatsPanelProps) {
  const { t } = useLanguage();
  const summary = summarizeSessionStats(stats);

  if (summary.total === 0) {
    return (
      <section
        className={`session-stats${compact ? ' session-stats--compact' : ''}`}
        aria-label={t('stats.aria')}
      >
        <p className="session-stats-empty">{t('stats.empty')}</p>
      </section>
    );
  }

  return (
    <section
      className={`session-stats${compact ? ' session-stats--compact' : ''}`}
      aria-label={t('stats.aria')}
    >
      <h3 className="session-stats-title">{t('stats.title')}</h3>
      <p className="session-stats-total">
        {t('stats.played')} <strong>{summary.total}</strong>
      </p>
      <ul className="session-stats-grid">
        <li>
          <span className="session-stats-label">{t('stats.wins')}</span>
          <span className="session-stats-value session-stats-value--win">
            {summary.wins}
          </span>
        </li>
        <li>
          <span className="session-stats-label">{t('stats.draws')}</span>
          <span className="session-stats-value session-stats-value--draw">
            {summary.draws}
          </span>
        </li>
        <li>
          <span className="session-stats-label">{t('stats.losses')}</span>
          <span className="session-stats-value session-stats-value--loss">
            {summary.losses}
          </span>
        </li>
        <li>
          <span className="session-stats-label">{t('stats.aborted')}</span>
          <span className="session-stats-value session-stats-value--aborted">
            {summary.aborted}
          </span>
        </li>
      </ul>
    </section>
  );
}
