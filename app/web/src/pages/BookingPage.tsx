import { useState, type FormEvent } from 'react';
import { addDays, nightsBetween, todayInZone } from '../../../shared/dates.ts';
import { roomPricing } from '../../../shared/pricing.ts';
import { isCheckOutSelectable, MAX_NIGHTS, validateStay } from '../../../shared/stay-rules.ts';
import type { Booking, Property } from '../../../shared/types.ts';
import { api, ApiError, useApi } from '../api.ts';
import { BackLink, LoadError, Loading, Money } from '../components/common.tsx';
import { DatePicker } from '../components/DatePicker.tsx';
import { PriceSummary } from '../components/PriceSummary.tsx';
import { useI18n } from '../i18n.tsx';
import { navigate } from '../router.tsx';

const ADULT_OPTIONS = [1, 2, 3, 4, 5, 6];
const CHILD_OPTIONS = [0, 1, 2, 3, 4];

export function BookingPage({ propertyId }: { propertyId: string }) {
  const { t, localized } = useI18n();
  const { data: property, error } = useApi<Property>(`/api/properties/${propertyId}`);
  const [roomTypeId, setRoomTypeId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverErrorKey, setServerErrorKey] = useState<string | null>(null);

  if (error) return <LoadError error={error} />;
  if (!property) return <Loading />;

  const room = property.roomTypes.find((r) => r.id === roomTypeId) ?? property.roomTypes[0];
  // "Today" is today at the hotel: it may already be tomorrow in Tokyo.
  const today = todayInZone(property.timeZone);
  const lastBookableDay = addDays(today, 365);

  const stayErrors =
    checkIn && checkOut
      ? validateStay({ checkIn, checkOut, adults, children, maxGuests: room.maxGuests, today })
      : [];
  const dateErrors = stayErrors.filter((e) => e !== 'tooManyGuests' && e !== 'noAdults');
  const tooManyGuests = adults + children > room.maxGuests;
  const canBook = Boolean(checkIn && checkOut) && stayErrors.length === 0 && !tooManyGuests;
  const pricing =
    canBook && checkIn && checkOut
      ? roomPricing(room.nightlyRate, nightsBetween(checkIn, checkOut), property.roomTaxRate, property.nightlyFee)
      : null;

  function chooseCheckIn(day: string) {
    setCheckIn(day);
    // A new check-in date can make the chosen check-out date invalid.
    if (checkOut && !isCheckOutSelectable(checkOut, day)) setCheckOut(null);
  }

  async function book(event: FormEvent) {
    event.preventDefault();
    if (!canBook || submitting) return;
    setSubmitting(true);
    setServerErrorKey(null);
    try {
      const booking = await api<Booking>('POST', '/api/bookings', {
        propertyId: property!.id,
        roomTypeId: room.id,
        checkIn,
        checkOut,
        adults,
        children,
      });
      navigate(`/bookings/${booking.reference}`);
    } catch (problem) {
      const detail = problem instanceof ApiError ? problem.details[0] : undefined;
      setServerErrorKey(detail ? `booking.error.${detail}` : 'common.error');
      setSubmitting(false);
    }
  }

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <h1 data-testid="booking-title">{t('booking.title', { name: property.name })}</h1>

      <form className="booking-form" data-testid="booking-form" onSubmit={book} noValidate>
        <fieldset className="card">
          <legend>{t('booking.room')}</legend>
          <div className="room-options">
            {property.roomTypes.map((option) => (
              <label key={option.id} className="room-option" data-testid={`room-option-${option.id}`}>
                <input
                  type="radio"
                  name="room"
                  value={option.id}
                  checked={option.id === room.id}
                  onChange={() => setRoomTypeId(option.id)}
                />
                <span className="room-option-name">{localized(option.name)}</span>
                <span className="room-option-detail">{t('booking.maxGuests', { count: option.maxGuests })}</span>
                <span className="room-option-detail">
                  <Money amount={option.nightlyRate} currency={property.currency} testId={`room-rate-${option.id}`} />
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="card">
          <legend>{t('booking.dates')}</legend>
          <div className="date-fields">
            <DatePicker
              id="checkin"
              label={t('booking.checkIn')}
              value={checkIn}
              min={today}
              max={lastBookableDay}
              onChange={chooseCheckIn}
            />
            <DatePicker
              id="checkout"
              label={t('booking.checkOut')}
              value={checkOut}
              min={checkIn ?? today}
              max={checkIn ? addDays(checkIn, MAX_NIGHTS) : lastBookableDay}
              disabled={!checkIn}
              isDayDisabled={(day) => !checkIn || !isCheckOutSelectable(day, checkIn)}
              onChange={setCheckOut}
            />
          </div>
          {dateErrors.length > 0 && (
            <p className="form-error" role="alert" data-testid="date-error">
              {t(`booking.error.${dateErrors[0]}`)}
            </p>
          )}
        </fieldset>

        <fieldset className="card">
          <legend>{t('booking.guests')}</legend>
          <div className="guest-fields">
            <label className="field">
              <span className="field-label">{t('booking.adults')}</span>
              <select data-testid="adults-select" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                {ADULT_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">{t('booking.children')}</span>
              <select data-testid="children-select" value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                {CHILD_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {tooManyGuests && (
            <p className="form-error" role="alert" data-testid="guest-limit-error">
              {t('booking.error.tooManyGuests', { count: room.maxGuests })}
            </p>
          )}
        </fieldset>

        <section className="card" aria-labelledby="summary-title">
          <h2 id="summary-title">{t('booking.summary')}</h2>
          {pricing ? <PriceSummary pricing={pricing} property={property} /> : <p>{t('booking.chooseDates')}</p>}
          {serverErrorKey && (
            <p className="form-error" role="alert" data-testid="booking-error">
              {t(serverErrorKey, { count: room.maxGuests })}
            </p>
          )}
          <button type="submit" className="button" data-testid="book-button" disabled={!canBook || submitting}>
            {submitting ? t('booking.submitting') : t('booking.submit')}
          </button>
        </section>
      </form>
    </>
  );
}
