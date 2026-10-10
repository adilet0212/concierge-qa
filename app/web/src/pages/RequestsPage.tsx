import { useState, type FormEvent } from 'react';
import { REQUEST_STATUSES, REQUEST_TYPES, type GuestRequest, type Property, type RequestType } from '../../../shared/types.ts';
import { api, useApi } from '../api.ts';
import { BackLink, LoadError, Loading, StatusTimeline } from '../components/common.tsx';
import { useI18n } from '../i18n.tsx';

const POLL_MS = 2000;

export function RequestsPage({ propertyId }: { propertyId: string }) {
  const { t } = useI18n();
  const { data: property, error } = useApi<Property>(`/api/properties/${propertyId}`);
  // Housekeeping updates requests from their own tools, so the list polls for status changes.
  const { data: requests, reload } = useApi<GuestRequest[]>(`/api/requests?propertyId=${propertyId}`, POLL_MS);
  const [type, setType] = useState<RequestType>('extra-pillows');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  if (error) return <LoadError error={error} />;
  if (!property || !requests) return <Loading />;

  async function sendRequest(event: FormEvent) {
    event.preventDefault();
    setStatus('sending');
    try {
      await api('POST', '/api/requests', { propertyId, type, note });
      setNote('');
      setStatus('sent');
      reload();
    } catch {
      setStatus('failed');
    }
  }

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <h1 data-testid="requests-title">{t('requests.title')}</h1>

      <form className="card" onSubmit={sendRequest} aria-labelledby="new-request-title">
        <h2 id="new-request-title">{t('requests.newRequest')}</h2>
        <label className="field">
          <span className="field-label">{t('requests.typeLabel')}</span>
          <select data-testid="request-type" value={type} onChange={(e) => setType(e.target.value as RequestType)}>
            {REQUEST_TYPES.map((option) => (
              <option key={option} value={option}>
                {t(`request.type.${option}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">{t('requests.noteLabel')}</span>
          <textarea data-testid="request-note" rows={2} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        {status === 'sent' && (
          <p className="form-success" role="status" data-testid="request-created">
            {t('requests.created')}
          </p>
        )}
        {status === 'failed' && (
          <p className="form-error" role="alert" data-testid="request-error">
            {t('common.error')}
          </p>
        )}
        <button type="submit" className="button" data-testid="request-submit" disabled={status === 'sending'}>
          {t('requests.submit')}
        </button>
      </form>

      <section aria-labelledby="your-requests-title">
        <h2 id="your-requests-title">{t('requests.yourRequests')}</h2>
        {requests.length === 0 ? (
          <p data-testid="requests-empty">{t('requests.empty')}</p>
        ) : (
          <ul className="request-list">
            {requests.map((request) => (
              <li key={request.id} className="card" data-testid={`request-item-${request.id}`} data-request-type={request.type}>
                <h3>{t(`request.type.${request.type}`)}</h3>
                {request.note && <p className="note">{request.note}</p>}
                <p>
                  {t('order.statusLabel')}:{' '}
                  <strong data-testid={`request-status-${request.id}`} data-status={request.status}>
                    {t(`request.status.${request.status}`)}
                  </strong>
                </p>
                <StatusTimeline
                  steps={REQUEST_STATUSES}
                  current={request.status}
                  labelPrefix="request.status."
                  testIdPrefix={`request-step-${request.id}`}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
