import { BasePage } from './BasePage.ts';

export type DateField = 'checkin' | 'checkout';
export type PricePart = 'nightly' | 'nights' | 'subtotal' | 'taxes' | 'fees' | 'total';

class BookingPage extends BasePage {
  get form() {
    return this.byTestId('booking-form');
  }

  roomOption(roomId: string) {
    return this.byTestId(`room-option-${roomId}`);
  }

  dateInput(field: DateField) {
    return this.byTestId(`${field}-input`);
  }

  calendar(field: DateField) {
    return this.byTestId(`${field}-calendar`);
  }

  calendarDay(field: DateField, isoDate: string) {
    return this.byTestId(`${field}-day-${isoDate}`);
  }

  previousMonthButton(field: DateField) {
    return this.byTestId(`${field}-prev`);
  }

  nextMonthButton(field: DateField) {
    return this.byTestId(`${field}-next`);
  }

  get adultsSelect() {
    return this.byTestId('adults-select');
  }

  get childrenSelect() {
    return this.byTestId('children-select');
  }

  get guestLimitError() {
    return this.byTestId('guest-limit-error');
  }

  get bookButton() {
    return this.byTestId('book-button');
  }

  /** A line of the price summary. Its data-amount attribute holds the exact amount in minor units. */
  price(part: PricePart) {
    return this.byTestId(`price-${part}`);
  }

  async chooseRoom(roomId: string) {
    await this.roomOption(roomId).click();
  }

  async openCalendar(field: DateField) {
    await this.dateInput(field).click();
    await this.calendar(field).waitForDisplayed();
  }

  /** The calendar opens on the current month; click "next month" until the day is shown (max a year). */
  async showMonthWith(field: DateField, isoDate: string) {
    for (let i = 0; i < 13 && !(await this.calendarDay(field, isoDate).isExisting()); i++) {
      await this.nextMonthButton(field).click();
    }
  }

  async pickDate(field: DateField, isoDate: string) {
    await this.openCalendar(field);
    await this.showMonthWith(field, isoDate);
    await this.calendarDay(field, isoDate).click();
  }

  async chooseStay(checkIn: string, checkOut: string) {
    await this.pickDate('checkin', checkIn);
    await this.pickDate('checkout', checkOut);
  }

  async chooseGuests(adults: number, children: number) {
    await this.adultsSelect.selectByAttribute('value', String(adults));
    await this.childrenSelect.selectByAttribute('value', String(children));
  }
}

export default new BookingPage();
