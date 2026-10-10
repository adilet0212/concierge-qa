import { expect } from '@wdio/globals';
import BookingPage from '../pageobjects/BookingPage.ts';
import ConfirmationPage from '../pageobjects/ConfirmationPage.ts';
import { api } from '../support/api-client.ts';
import { addDays, futureStay, todayIn } from '../support/dates.ts';
import { expectedRoomPrice } from '../support/expected.ts';
import { openAs } from '../support/session.ts';
import { properties, property } from '../support/test-data.ts';

describe('Room booking @regression', () => {
  it('books a room and shows the confirmation @smoke', async () => {
    const toronto = property('toronto');
    const stay = futureStay(toronto.timeZone, 30, 3);
    const guest = await api.createGuest('booking');
    await openAs(guest, `/properties/${toronto.id}/book`);

    await BookingPage.chooseRoom(toronto.testRoom.id);
    await BookingPage.chooseStay(stay.checkIn, stay.checkOut);
    await BookingPage.chooseGuests(2, 0);
    await BookingPage.bookButton.click();

    await expect(ConfirmationPage.title).toHaveText('Your stay is confirmed');
    await expect(ConfirmationPage.reference).toHaveText(/^AUR-[A-Z0-9]{6}$/);
    await expect(ConfirmationPage.nights).toHaveText('3');
    await expect(ConfirmationPage.price('total')).toHaveAttribute('data-amount', String(expectedRoomPrice(toronto, 3).total));
  });

  it('does not allow check-out on the check-in date', async () => {
    const paris = property('paris');
    const stay = futureStay(paris.timeZone, 10, 1);
    const guest = await api.createGuest('dates');
    await openAs(guest, `/properties/${paris.id}/book`);

    await BookingPage.pickDate('checkin', stay.checkIn);
    await BookingPage.openCalendar('checkout');

    // A stay is at least one night: the check-in day itself must not be selectable as check-out...
    await expect(BookingPage.calendarDay('checkout', stay.checkIn)).toBeDisabled();
    // ...but the next day must be.
    await BookingPage.showMonthWith('checkout', stay.checkOut);
    await expect(BookingPage.calendarDay('checkout', stay.checkOut)).toBeEnabled();
  });

  it('does not allow check-in dates in the past', async () => {
    const tokyo = property('tokyo');
    const today = todayIn(tokyo.timeZone); // "today" at the hotel, which may differ from today here
    const yesterday = addDays(today, -1);
    const guest = await api.createGuest('past');
    await openAs(guest, `/properties/${tokyo.id}/book`);

    await BookingPage.openCalendar('checkin');

    await expect(BookingPage.previousMonthButton('checkin')).toBeDisabled();
    await expect(BookingPage.calendarDay('checkin', today)).toBeEnabled();
    // On the 1st of the month yesterday is in last month, which the calendar can't show (checked above).
    if (yesterday.slice(0, 7) === today.slice(0, 7)) {
      await expect(BookingPage.calendarDay('checkin', yesterday)).toBeDisabled();
    }
  });

  it('limits the number of guests to the room capacity', async () => {
    const dubai = property('dubai');
    const { maxGuests } = dubai.testRoom;
    const guest = await api.createGuest('guests');
    await openAs(guest, `/properties/${dubai.id}/book`);
    await BookingPage.chooseRoom(dubai.testRoom.id);

    await BookingPage.chooseGuests(maxGuests, 1);
    await expect(BookingPage.guestLimitError).toHaveText(`This room fits up to ${maxGuests} guests.`);
    await expect(BookingPage.bookButton).toBeDisabled();

    await BookingPage.chooseGuests(maxGuests, 0);
    await expect(BookingPage.guestLimitError).not.toBeExisting();
  });

  // Data-driven: one test per property in test-data/properties.json.
  for (const hotel of properties) {
    it(`calculates the room price for ${hotel.name}`, async () => {
      const stay = futureStay(hotel.timeZone, 20, 4);
      const expected = expectedRoomPrice(hotel, stay.nights);
      const guest = await api.createGuest('price');
      await openAs(guest, `/properties/${hotel.id}/book`);

      await BookingPage.chooseRoom(hotel.testRoom.id);
      await BookingPage.chooseStay(stay.checkIn, stay.checkOut);
      await BookingPage.chooseGuests(1, 0);

      // data-amount holds the exact amount in minor units, so this works in every language and currency.
      await expect(BookingPage.price('nightly')).toHaveAttribute('data-amount', String(expected.nightlyRate));
      await expect(BookingPage.price('nights')).toHaveText(String(stay.nights));
      await expect(BookingPage.price('subtotal')).toHaveAttribute('data-amount', String(expected.roomSubtotal));
      await expect(BookingPage.price('taxes')).toHaveAttribute('data-amount', String(expected.taxes));
      await expect(BookingPage.price('fees')).toHaveAttribute('data-amount', String(expected.fees));
      await expect(BookingPage.price('total')).toHaveAttribute('data-amount', String(expected.total));
    });
  }

  for (const hotel of properties) {
    it(`shows check-in and check-out in local time at ${hotel.name}`, async () => {
      const stay = futureStay(hotel.timeZone, 45, 2);
      const guest = await api.createGuest('localtime');
      // This test is about the confirmation page, so the booking is created through the API.
      const booking = await api.createBooking(guest, {
        propertyId: hotel.id,
        roomTypeId: hotel.testRoom.id,
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        adults: 1,
      });

      await openAs(guest, `/bookings/${booking.reference}`);

      // Check-in is 15:00 and check-out 12:00 in the hotel's own time zone, wherever the guest is.
      await expect(ConfirmationPage.checkIn).toHaveAttribute('data-local-date', stay.checkIn);
      await expect(ConfirmationPage.checkIn).toHaveAttribute('data-local-time', '15:00');
      await expect(ConfirmationPage.checkOut).toHaveAttribute('data-local-date', stay.checkOut);
      await expect(ConfirmationPage.checkOut).toHaveAttribute('data-local-time', '12:00');
    });
  }
});
