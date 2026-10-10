import { useState, type FormEvent } from 'react';
import type { ChatMessage, Property } from '../../../shared/types.ts';
import { api, useApi } from '../api.ts';
import { BackLink, LoadError, Loading } from '../components/common.tsx';
import { useI18n } from '../i18n.tsx';
import { useSession } from '../session.tsx';

const POLL_MS = 1500;

export function ChatPage({ propertyId }: { propertyId: string }) {
  const { t } = useI18n();
  const { guest } = useSession();
  const { data: property, error } = useApi<Property>(`/api/properties/${propertyId}`);
  // Polls for new messages (the concierge's reply arrives a moment after the guest's message).
  const { data: messages, reload } = useApi<ChatMessage[]>(`/api/chat/${propertyId}`, POLL_MS);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  if (error) return <LoadError error={error} />;
  if (!property || !messages) return <Loading />;

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await api('POST', `/api/chat/${propertyId}`, { text });
      setText('');
      reload();
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <h1 data-testid="chat-title">{t('chat.title')}</h1>

      <section className="card chat">
        <div className="chat-thread" role="log" aria-live="polite" aria-label={t('chat.title')} data-testid="chat-thread">
          {messages.length === 0 && <p data-testid="chat-empty">{t('chat.empty')}</p>}
          {messages.map((message) => (
            <div key={message.id} className={`chat-message from-${message.from}`} data-testid="chat-message" data-from={message.from}>
              <span className="chat-author">{message.from === 'guest' ? t('chat.you') : t('chat.concierge')}</span>
              <p>{message.text ?? t(message.templateKey ?? '', { name: guest?.name ?? '', property: property.name })}</p>
            </div>
          ))}
        </div>

        <form className="chat-form" onSubmit={send}>
          <label className="field">
            <span className="field-label">{t('chat.inputLabel')}</span>
            <input data-testid="chat-input" maxLength={500} value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <button type="submit" className="button" data-testid="chat-send" disabled={sending || !text.trim()}>
            {t('chat.send')}
          </button>
        </form>
      </section>
    </>
  );
}
