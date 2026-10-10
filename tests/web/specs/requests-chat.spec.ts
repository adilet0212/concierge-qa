import { expect } from '@wdio/globals';
import ChatPage from '../pageobjects/ChatPage.ts';
import RequestsPage from '../pageobjects/RequestsPage.ts';
import { api } from '../support/api-client.ts';
import { openAs } from '../support/session.ts';

describe('Guest requests and chat @regression', () => {
  it('sends a guest request and follows its status @smoke', async () => {
    const guest = await api.createGuest('request');
    await openAs(guest, '/properties/paris/requests');

    await RequestsPage.sendRequest('extra-pillows', 'Two firm pillows, please');
    await expect(RequestsPage.sentMessage).toBeDisplayed();

    const [request] = await api.listRequests(guest);
    await expect(RequestsPage.status(request.id)).toHaveText('Requested');

    // Housekeeping acknowledges the request from their own tool; the page polls and updates.
    await api.setRequestStatus(request.id, 'acknowledged');
    await expect(RequestsPage.status(request.id)).toHaveText('Acknowledged');
    await expect(RequestsPage.step(request.id, 'requested')).toHaveAttribute('data-state', 'done');
    await expect(RequestsPage.step(request.id, 'acknowledged')).toHaveAttribute('data-state', 'current');
  });

  it('chats with the concierge and receives a reply @smoke', async () => {
    const guest = await api.createGuest('chat');
    await openAs(guest, '/properties/dubai/chat');

    await ChatPage.send('Could you book a table for two at 8pm?');

    await expect(ChatPage.guestMessages).toBeElementsArrayOfSize(1);
    // The concierge's reply arrives a moment later; the matcher waits for it.
    await expect(ChatPage.conciergeMessages).toBeElementsArrayOfSize(1);
    await expect(ChatPage.conciergeMessages[0]).toHaveText(`Thank you, ${guest.name}.`, { containing: true });
  });
});
