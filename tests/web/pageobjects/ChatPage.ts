import { $$ } from '@wdio/globals';
import { BasePage } from './BasePage.ts';

class ChatPage extends BasePage {
  get title() {
    return this.byTestId('chat-title');
  }

  get messageInput() {
    return this.byTestId('chat-input');
  }

  get sendButton() {
    return this.byTestId('chat-send');
  }

  get guestMessages() {
    return $$('[data-testid="chat-message"][data-from="guest"]');
  }

  get conciergeMessages() {
    return $$('[data-testid="chat-message"][data-from="concierge"]');
  }

  async send(text: string) {
    await this.messageInput.setValue(text);
    await this.sendButton.click();
  }
}

export default new ChatPage();
