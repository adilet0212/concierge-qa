import type { Booking, Property } from '../../../shared/types.ts';
import { useApi } from '../api.ts';
import { BackLink, LoadError, Loading, StayTime } from '../components/common.tsx';
import { PriceSummary } from '../components/PriceSummary.tsx';
import { useI18n } from '../i18n.tsx';

export function ConfirmationPage({ reference }: { reference: string }) {
  const { t, localized } = useI18n();
  const { data: booking, error } = useApi<Booking>(`/api/bookings/${reference}`);
  const { data: property } = useApi<Property>(booking ? `/api/properties/${booking.propertyId}` : null);

  if (error) return <LoadError error={error} />;
  if (!booking || !property) return <Loading />;

  const room = property.roomTypes.find((r) => r.id === booking.roomTypeId);

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <section className="card confirmation">
        <h1 data-testid="confirmation-title">{t('booking.confirm.title')}</h1>
        <p className="lead">{t('booking.confirm.subtitle', { name: property.name })}</p>

        <dl className="details">
          <div>
            <dt>{t('booking.confirm.reference')}</dt>
            <dd className="reference" data-testid="booking-reference">
              {booking.reference}
            </dd>
          </div>
          <div>
            <dt>{t('booking.confirm.room')}</dt>
            <dd data-testid="confirmation-room">{room ? localized(room.name) : booking.roomTypeId}</dd>
          </div>
          <div>
            <dt>{t('booking.confirm.checkIn')}</dt>
            <dd>
              <StayTime testId="confirmation-checkin" instant={booking.checkInAt} timeZone={property.timeZone} />
            </dd>
          </div>
          <div>
            <dt>{t('booking.confirm.checkOut')}</dt>
            <dd>
              <StayTime testId="confirmation-checkout" instant={booking.checkOutAt} timeZone={property.timeZone} />
            </dd>
          </div>
          <div>
            <dt>{t('booking.confirm.guests')}</dt>
            <dd data-testid="confirmation-guests">
              {t('booking.guestsSummary', { adults: booking.adults, children: booking.children })}
            </dd>
          </div>
          <div>
            <dt>{t('booking.confirm.nights')}</dt>
            <dd data-testid="confirmation-nights">{booking.pricing.nights}</dd>
          </div>
        </dl>
        <p className="note">{t('booking.confirm.timeZoneNote', { city: localized(property.city) })}</p>
      </section>

      <section className="card" aria-labelledby="confirmation-summary">
        <h2 id="confirmation-summary">{t('booking.summary')}</h2>
        <PriceSummary pricing={booking.pricing} property={property} />
      </section>
    </>
  );
}
