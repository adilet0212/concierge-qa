import type { Property } from '../../../shared/types.ts';
import { useApi } from '../api.ts';
import { BackLink, LoadError, Loading } from '../components/common.tsx';
import { formatPropertyTime, useNow } from '../format.ts';
import { useI18n } from '../i18n.tsx';
import { Link } from '../router.tsx';

const ACTIONS = ['book', 'dining', 'requests', 'chat', 'spa'] as const;

export function PropertyPage({ propertyId }: { propertyId: string }) {
  const { t, locale, localized } = useI18n();
  const { data: property, error } = useApi<Property>(`/api/properties/${propertyId}`);
  const now = useNow();

  if (error) return <LoadError error={error} />;
  if (!property) return <Loading />;

  return (
    <>
      <BackLink to="/" label={t('common.backHome')} />
      <h1 data-testid="property-title">{property.name}</h1>
      <p className="lead">
        {localized(property.city)}, {localized(property.country)}
      </p>
      <dl className="property-facts property-facts-inline">
        <div>
          <dt>{t('properties.localTime')}</dt>
          <dd data-testid="property-local-time" data-time-zone={property.timeZone}>
            {formatPropertyTime(property.timeZone, locale, now)}
          </dd>
        </div>
        <div>
          <dt>{t('properties.currency')}</dt>
          <dd data-testid="property-currency">{property.currency}</dd>
        </div>
      </dl>
      <p>{t('property.checkInOut', { checkIn: property.checkInTime, checkOut: property.checkOutTime })}</p>

      <h2>{t('property.actionsTitle')}</h2>
      <ul className="action-grid">
        {ACTIONS.map((action) => (
          <li key={action}>
            <Link
              to={`/properties/${property.id}/${action}`}
              className="card action-card"
              data-testid={`action-${action}`}
            >
              {t(`property.action.${action}`)}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
