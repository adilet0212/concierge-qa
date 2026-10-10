import { expect } from '@wdio/globals';
import BookingPage from '../pageobjects/BookingPage.ts';
import ChatPage from '../pageobjects/ChatPage.ts';
import ConfirmationPage from '../pageobjects/ConfirmationPage.ts';
import DiningPage from '../pageobjects/DiningPage.ts';
import OrderPage from '../pageobjects/OrderPage.ts';
import PropertiesPage from '../pageobjects/PropertiesPage.ts';
import PropertyPage from '../pageobjects/PropertyPage.ts';
import RequestsPage from '../pageobjects/RequestsPage.ts';
import SignInPage from '../pageobjects/SignInPage.ts';
import { seriousAccessibilityViolations } from '../support/accessibility.ts';
import { api, uniqueEmail, type Guest } from '../support/api-client.ts';
import { futureStay } from '../support/dates.ts';
import { openAs, openSignedOut } from '../support/session.ts';
import { property } from '../support/test-data.ts';

const tokyo = property('tokyo');

interface PageUnderTest {
  name: string;
  /** Creates any data the page needs and returns its URL. */
  path(guest: Guest): Promise<string> | string;
  signedIn: boolean;
  /** Waits until the page is ready, and puts it in an interesting state (open calendar, full cart...). */
  prepare(): Promise<void>;
}

const PAGES: PageUnderTest[] = [
  {
    name: 'Sign-in (email step)',
    path: () => '/sign-in',
    signedIn: false,
    prepare: async () => {
      await expect(SignInPage.emailInput).toBeDisplayed();
    },
  },
  {
    name: 'Sign-in (code step with dev inbox)',
    path: () => '/sign-in',
    signedIn: false,
    prepare: async () => {
      await SignInPage.requestCode(uniqueEmail('a11y'));
    },
  },
  {
    name: 'Properties',
    path: () => '/',
    signedIn: true,
    prepare: async () => {
      await expect(PropertiesPage.title).toBeDisplayed();
    },
  },
  {
    name: 'Property',
    path: () => `/properties/${tokyo.id}`,
    signedIn: true,
    prepare: async () => {
      await expect(PropertyPage.title).toBeDisplayed();
    },
  },
  {
    name: 'Booking form (calendar open)',
    path: () => `/properties/${tokyo.id}/book`,
    signedIn: true,
    prepare: async () => {
      await BookingPage.openCalendar('checkin');
    },
  },
  {
    name: 'Booking confirmation',
    path: async (guest) => {
      const stay = futureStay(tokyo.timeZone, 25, 2);
      const booking = await api.createBooking(guest, { propertyId: tokyo.id, roomTypeId: tokyo.testRoom.id, ...stay, adults: 1 });
      return `/bookings/${booking.reference}`;
    },
    signedIn: true,
    prepare: async () => {
      await expect(ConfirmationPage.title).toBeDisplayed();
    },
  },
  {
    name: 'In-room dining (dish in cart)',
    path: () => `/properties/${tokyo.id}/dining`,
    signedIn: true,
    prepare: async () => {
      await DiningPage.addDish('club-sandwich');
      await expect(DiningPage.quantity('club-sandwich')).toHaveText('1');
    },
  },
  {
    name: 'Order status',
    path: async (guest) => {
      const order = await api.placeOrder(guest, tokyo.id, [{ menuItemId: 'club-sandwich', quantity: 1 }]);
      return `/orders/${order.id}`;
    },
    signedIn: true,
    prepare: async () => {
      await expect(OrderPage.status).toBeDisplayed();
    },
  },
  {
    name: 'Guest requests',
    path: () => `/properties/${tokyo.id}/requests`,
    signedIn: true,
    prepare: async () => {
      await expect(RequestsPage.title).toBeDisplayed();
    },
  },
  {
    name: 'Concierge chat',
    path: () => `/properties/${tokyo.id}/chat`,
    signedIn: true,
    prepare: async () => {
      await expect(ChatPage.title).toBeDisplayed();
    },
  },
];

describe('Accessibility (WCAG 2.1 AA) @regression', () => {
  for (const page of PAGES) {
    it(`${page.name} page has no serious or critical accessibility violations`, async () => {
      const guest = await api.createGuest('a11y');
      const path = await page.path(guest);
      if (page.signedIn) await openAs(guest, path);
      else await openSignedOut(path);

      await page.prepare();

      // The message lists every violation, so one failing run shows the whole picture.
      expect(await seriousAccessibilityViolations()).toEqual([]);
    });
  }
});
