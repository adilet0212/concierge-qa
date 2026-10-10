import type { Property, RoomPricing } from '../../../shared/types.ts';
import { formatPercent } from '../format.ts';
import { useI18n } from '../i18n.tsx';
import { Money } from './common.tsx';

/** Room price breakdown, shown on the booking form and on the confirmation page. */
export function PriceSummary({ pricing, property }: { pricing: RoomPricing; property: Property }) {
  const { t, locale } = useI18n();
  const currency = property.currency;

  return (
    <dl className="price-summary" data-testid="price-summary">
      <div>
        <dt>{t('booking.nightlyRate')}</dt>
        <dd>
          <Money testId="price-nightly" amount={pricing.nightlyRate} currency={currency} />
        </dd>
      </div>
      <div>
        <dt>{t('booking.nights')}</dt>
        <dd data-testid="price-nights">{pricing.nights}</dd>
      </div>
      <div>
        <dt>{t('booking.roomSubtotal')}</dt>
        <dd>
          <Money testId="price-subtotal" amount={pricing.roomSubtotal} currency={currency} />
        </dd>
      </div>
      <div>
        <dt>{t('booking.taxes', { rate: formatPercent(property.roomTaxRate, locale) })}</dt>
        <dd>
          <Money testId="price-taxes" amount={pricing.taxes} currency={currency} />
        </dd>
      </div>
      <div>
        <dt>{t('booking.fees')}</dt>
        <dd>
          <Money testId="price-fees" amount={pricing.fees} currency={currency} />
        </dd>
      </div>
      <div className="price-total">
        <dt>{t('booking.total')}</dt>
        <dd>
          <Money testId="price-total" amount={pricing.total} currency={currency} />
        </dd>
      </div>
    </dl>
  );
}
