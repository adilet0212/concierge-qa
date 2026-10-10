import { BasePage } from './BasePage.ts';

class RequestsPage extends BasePage {
  get title() {
    return this.byTestId('requests-title');
  }

  get typeSelect() {
    return this.byTestId('request-type');
  }

  get noteInput() {
    return this.byTestId('request-note');
  }

  get submitButton() {
    return this.byTestId('request-submit');
  }

  get sentMessage() {
    return this.byTestId('request-created');
  }

  get requestItems() {
    return this.allByTestIdPrefix('request-item-');
  }

  status(requestId: string) {
    return this.byTestId(`request-status-${requestId}`);
  }

  step(requestId: string, status: string) {
    return this.byTestId(`request-step-${requestId}-${status}`);
  }

  async sendRequest(type: string, note: string) {
    await this.typeSelect.selectByAttribute('value', type);
    await this.noteInput.setValue(note);
    await this.submitButton.click();
  }
}

export default new RequestsPage();
