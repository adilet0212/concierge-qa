import { useState, type FormEvent } from 'react';
import { addDays, todayInZone } from '../../../shared/dates.ts';
import { SPA_TIMES, type Property, type SpaBooking } from '../../../shared/types.ts';
import { api, ApiError, useApi } from '../api.ts';
import { BackLink, LoadError, Loading, Money } from '../components/common.tsx';
import { formatCalendarDate } from '../format.ts';
import { useI18n } from '../i18n.tsx';

// Spa booking. This screen has NO automated tests on purpose: writing them is a hands-on
// exercise (see docs/MAKE_IT_YOURS.md). The test ids below are ready for you to use.
export function SpaPage({ propertyId }: { propertyId: string }) {
  const { t, locale, localized } = useI18n();
  const { data: property, error } = useApi<Property>(`/api/properties/${propertyId}`);
  const [treatmentId, setTreatmentId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState(SPA_TIMES[0]);
  const [booking, setBooking] = useState<SpaBooking | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  if (error) return <LoadError error={error} />;
  if (!property) return <Loading />;

  const today = todayInZone(property.timeZone);
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));
  const treatment = property.spaTreatments.find((tr) => tr.id === treatmentId) ?? property.spaTreatments[0];
  const chosenDate = date ?? dates[1];

  async function book(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    try {
      const result = await api<SpaBooking>('POST', '/api/spa/bookings', {
        propertyId,
        treatmentId: treatment.id,
        date: chosenDate,
        time,
      });
      setBooking(result);
    } catch (problem) {
      const slotTaken = problem instanceof ApiError && problem.details.includes('slotTaken');
      setErrorKey(slotTaken ? 'spa.error.slotTaken' : 'common.error');
    }
  }

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <h1 data-testid="spa-title">{t('spa.title', { name: property.name })}</h1>

      <form className="card" onSubmit={book}>
        <fieldset>
          <legend>{t('spa.treatment')}</legend>
          {property.spaTreatments.map((option) => (
            <label key={option.id} className="room-option" data-testid={`spa-treatment-${option.id}`}>
              <input
                type="radio"
                name="treatment"
                value={option.id}
                checked={option.id === treatment.id}
                onChange={() => setTreatmentId(option.id)}
              />
              <span className="room-option-name">{localized(option.name)}</span>
              <span className="room-option-detail">{t('spa.duration', { minutes: option.durationMinutes })}</span>
              <Money amount={option.price} currency={property.currency} testId={`spa-price-${option.id}`} />
            </label>
          ))}
        </fieldset>
        <div className="guest-fields">
          <label className="field">
            <span className="field-label">{t('spa.date')}</span>
            <select data-testid="spa-date" value={chosenDate} onChange={(e) => setDate(e.target.value)}>
              {dates.map((d) => (
                <option key={d} value={d}>
                  {formatCalendarDate(d, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field-label">{t('spa.time')}</span>
            <select data-testid="spa-time" value={time} onChange={(e) => setTime(e.target.value)}>
              {SPA_TIMES.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
        </div>
        {errorKey && (
          <p className="form-error" role="alert" data-testid="spa-error">
            {t(errorKey)}
          </p>
        )}
        {booking && (
          <p className="form-success" role="status" data-testid="spa-confirmation">
            {t('spa.confirmed', {
              treatment: localized(treatment.name),
              date: formatCalendarDate(booking.date, locale),
              time: booking.time,
            })}
          </p>
        )}
        <button type="submit" className="button" data-testid="spa-book">
          {t('spa.book')}
        </button>
      </form>
    </>
  );
}
