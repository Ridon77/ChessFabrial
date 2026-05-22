import {
  getChartMaxValue,
  getModeBreakdown,
  hasAnyAborted,
  type ModeStatsBreakdown,
} from '../chess/sessionStatsAnalytics';
import { useLanguage } from '../i18n/useLanguage';
import type { TranslationKey } from '../i18n/translations';
import type { SessionStats } from '../types/GameResult';

interface SessionStatsChartProps {
  stats: SessionStats;
}

const BAR_SERIES: {
  key: keyof Pick<ModeStatsBreakdown, 'wins' | 'draws' | 'losses' | 'aborted'>;
  labelKey: TranslationKey;
  className: string;
}[] = [
  { key: 'wins', labelKey: 'stats.chartWon', className: 'stats-chart-bar--win' },
  { key: 'draws', labelKey: 'stats.chartDrawn', className: 'stats-chart-bar--draw' },
  { key: 'losses', labelKey: 'stats.chartLost', className: 'stats-chart-bar--loss' },
  {
    key: 'aborted',
    labelKey: 'stats.chartAborted',
    className: 'stats-chart-bar--aborted',
  },
];

function ModeGroup({
  modeStats,
  maxValue,
  showAborted,
}: {
  modeStats: ModeStatsBreakdown;
  maxValue: number;
  showAborted: boolean;
}) {
  const { t } = useLanguage();
  const series = BAR_SERIES.filter(
    (item) => item.key !== 'aborted' || showAborted,
  );

  return (
    <div className="stats-chart-group">
      <h4 className="stats-chart-group-title">{modeStats.label}</h4>
      {modeStats.played === 0 ? (
        <p className="stats-chart-empty">{t('stats.chartEmpty')}</p>
      ) : (
        <ul className="stats-chart-bars">
          {series.map((item) => {
            const value = modeStats[item.key];
            const width = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <li key={item.key} className="stats-chart-bar-row">
                <span className="stats-chart-bar-label">{t(item.labelKey)}</span>
                <div className="stats-chart-bar-track" aria-hidden="true">
                  <div
                    className={`stats-chart-bar-fill ${item.className}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="stats-chart-bar-value">{value}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SessionStatsChart({ stats }: SessionStatsChartProps) {
  const { t, language } = useLanguage();
  const byMode = getModeBreakdown(stats, language);
  const maxValue = getChartMaxValue(byMode);
  const showAborted = hasAnyAborted(stats);

  return (
    <section className="stats-chart-panel" aria-labelledby="stats-chart-title">
      <h3 id="stats-chart-title" className="stats-summary-title">
        {t('stats.chartTitle')}
      </h3>
      <div className="stats-chart-groups">
        {byMode.map((modeStats) => (
          <ModeGroup
            key={modeStats.mode}
            modeStats={modeStats}
            maxValue={maxValue}
            showAborted={showAborted}
          />
        ))}
      </div>
      <ul className="stats-chart-legend" aria-hidden="true">
        {BAR_SERIES.filter((item) => item.key !== 'aborted' || showAborted).map(
          (item) => (
            <li key={item.key}>
              <span className={`stats-chart-legend-swatch ${item.className}`} />
              {t(item.labelKey)}
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
