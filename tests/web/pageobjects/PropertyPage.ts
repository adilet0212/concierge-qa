import { BasePage } from './BasePage.ts';

export type PropertyAction = 'book' | 'dining' | 'requests' | 'chat' | 'spa';

/** One property's page, with links to everything a guest can do there. */
class PropertyPage extends BasePage {
  get title() {
    return this.byTestId('property-title');
  }

  get localTime() {
    return this.byTestId('property-local-time');
  }

  get currency() {
    return this.byTestId('property-currency');
  }

  action(name: PropertyAction) {
    return this.byTestId(`action-${name}`);
  }
}

export default new PropertyPage();
