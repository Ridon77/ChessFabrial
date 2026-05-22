import { summarizeSessionStats } from '../chess/sessionStats';
import { useLanguage } from '../i18n/useLanguage';
import type { SessionStats } from '../types/GameResult';
import { SessionStatsChart } from './SessionStatsChart';
import { SessionStatsPanel } from './SessionStatsPanel';
import { SessionStatsTable } from './SessionStatsTable';

interface SessionHomeSummaryProps {
  stats: SessionStats;
}

export function SessionHomeSummary({ stats }: SessionHomeSummaryProps) {
  const { t } = useLanguage();
  const summary = summarizeSessionStats(stats);

  if (summary.total === 0) {
    return (
      <section className="session-home-summary" aria-label={t('stats.homeAria')}>
        <p className="session-home-summary-empty">{t('stats.homeEmpty')}</p>
      </section>
    );
  }

  return (
    <section className="session-home-summary" aria-label={t('stats.homeAria')}>
      <h2 className="session-home-summary__title">{t('home.statsSection')}</h2>
      <SessionStatsPanel stats={stats} />
      <SessionStatsChart stats={stats} />
      <SessionStatsTable stats={stats} />
    </section>
  );
}
