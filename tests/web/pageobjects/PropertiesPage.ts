import { BasePage } from './BasePage.ts';

/** The home page: the list of properties (destinations). */
class PropertiesPage extends BasePage {
  get title() {
    return this.byTestId('properties-title');
  }

  card(propertyId: string) {
    return this.byTestId(`property-card-${propertyId}`);
  }

  localTime(propertyId: string) {
    return this.byTestId(`property-local-time-${propertyId}`);
  }

  currency(propertyId: string) {
    return this.byTestId(`property-currency-${propertyId}`);
  }
}

export default new PropertiesPage();
