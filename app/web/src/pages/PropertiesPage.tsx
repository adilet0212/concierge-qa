import type { Property } from '../../../shared/types.ts';
import { useApi } from '../api.ts';
import { LoadError, Loading } from '../components/common.tsx';
import { formatPropertyTime, useNow } from '../format.ts';
import { useI18n } from '../i18n.tsx';
import { Link } from '../router.tsx';
import { useSession } from '../session.tsx';

export function PropertiesPage() {
  const { t, locale, localized } = useI18n();
  const { guest } = useSession();
  const { data: properties, error } = useApi<Property[]>('/api/properties');
  const now = useNow();

  if (error) return <LoadError error={error} />;
  if (!properties) return <Loading />;

  return (
    <>
      <h1 data-testid="properties-title">{t('properties.title')}</h1>
      <p className="lead">{t('properties.welcome', { name: guest?.name ?? '' })}</p>

      <ul className="property-grid">
        {properties.map((property) => (
          <li key={property.id}>
            <Link to={`/properties/${property.id}`} className="card property-card" data-testid={`property-card-${property.id}`}>
              <h2 className="property-name">{property.name}</h2>
              <p className="property-place">
                {localized(property.city)}, {localized(property.country)}
              </p>
              <dl className="property-facts">
                <div>
                  <dt>{t('properties.localTime')}</dt>
                  <dd data-testid={`property-local-time-${property.id}`} data-time-zone={property.timeZone}>
                    {formatPropertyTime(property.timeZone, locale, now)}
                  </dd>
                </div>
                <div>
                  <dt>{t('properties.currency')}</dt>
                  <dd data-testid={`property-currency-${property.id}`}>{property.currency}</dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
