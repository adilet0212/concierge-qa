import type { ApiError } from '../api.ts';
import { formatMoney, stayDateTime } from '../format.ts';
import { useI18n } from '../i18n.tsx';
import { Link } from '../router.tsx';

// Small presentational pieces used on several pages.

/** A price. data-amount (minor units) lets tests check the exact number in any language. */
export function Money({ amount, currency, testId }: { amount: number; currency: string; testId?: string }) {
  const { locale } = useI18n();
  return (
    <span data-testid={testId} data-amount={amount} data-currency={currency}>
      {formatMoney(amount, currency, locale)}
    </span>
  );
}

/** A check-in/check-out moment, shown in the property's time zone. */
export function StayTime({ instant, timeZone, testId }: { instant: string; timeZone: string; testId: string }) {
  const { locale } = useI18n();
  const { label, localDate, localTime } = stayDateTime(instant, timeZone, locale);
  return (
    <time data-testid={testId} dateTime={instant} data-local-date={localDate} data-local-time={localTime}>
      {label}
    </time>
  );
}

export function Loading() {
  const { t } = useI18n();
  return (
    <p className="page-message" role="status" data-testid="loading">
      {t('common.loading')}
    </p>
  );
}

export function LoadError({ error }: { error: ApiError }) {
  const { t } = useI18n();
  const notFound = error.status === 404;
  return (
    <div className="page-message" role="alert" data-testid="load-error">
      <h1>{notFound ? t('common.notFound.title') : t('common.error')}</h1>
      <Link to="/">{t('common.backHome')}</Link>
    </div>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="back-link" data-testid="back-link">
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}

/** A horizontal list of steps, e.g. Received → Preparing → On its way → Delivered. */
export function StatusTimeline({
  steps,
  current,
  labelPrefix,
  testIdPrefix,
}: {
  steps: readonly string[];
  current: string;
  labelPrefix: string;
  testIdPrefix: string;
}) {
  const { t } = useI18n();
  const currentIndex = steps.indexOf(current);
  return (
    <ol className="timeline" aria-label={t('common.progress')}>
      {steps.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming';
        return (
          <li
            key={step}
            className={`timeline-step is-${state}`}
            data-testid={`${testIdPrefix}-${step}`}
            data-state={state}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            {t(`${labelPrefix}${step}`)}
          </li>
        );
      })}
    </ol>
  );
}
