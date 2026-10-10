import { useState, type FormEvent } from 'react';
import { isBugOn } from '../../../shared/seeded-bugs.ts';
import type { Guest } from '../../../shared/types.ts';
import { api, ApiError } from '../api.ts';
import { useI18n } from '../i18n.tsx';
import { navigate } from '../router.tsx';
import { useSession } from '../session.tsx';

const SERVER_CODE_LENGTH = 6;

/** Where to go after signing in: the page the guest originally asked for, if any. */
function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get('next');
  return next && next.startsWith('/') ? next : '/';
}

export function SignInPage() {
  const { t } = useI18n();
  const { signIn } = useSession();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [inboxCode, setInboxCode] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // SEEDED BUG #6: the code field must accept as many digits as the server sends (6).
  // The buggy version only accepts 5, so the guest can never type the full code.
  const codeLength = isBugOn(6) ? 5 : SERVER_CODE_LENGTH;

  async function requestCode(event?: FormEvent) {
    event?.preventDefault();
    setErrorKey(null);
    setBusy(true);
    try {
      await api('POST', '/api/auth/request-code', { email });
      setStep('code');
      setCode('');
      // Demo only: show the code we "emailed" in the dev inbox panel.
      const inbox = await api<{ code: string }>('GET', `/api/dev/inbox?email=${encodeURIComponent(email)}`);
      setInboxCode(inbox.code);
    } catch (error) {
      setErrorKey(error instanceof ApiError && error.code === 'INVALID_EMAIL' ? 'signIn.error.invalidEmail' : 'common.error');
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    if (!new RegExp(`^\\d{${codeLength}}$`).test(code)) {
      setErrorKey('signIn.error.codeFormat');
      return;
    }
    setBusy(true);
    try {
      const result = await api<{ token: string; guest: Guest }>('POST', '/api/auth/verify-code', { email, code });
      signIn(result.token, result.guest);
      navigate(nextPath(), { replace: true });
    } catch (error) {
      const errorCode = error instanceof ApiError ? error.code : '';
      setErrorKey(
        errorCode === 'CODE_EXPIRED' ? 'signIn.error.expired' : errorCode === 'CODE_INVALID' ? 'signIn.error.invalid' : 'common.error',
      );
      setBusy(false);
    }
  }

  const error = errorKey && (
    <p className="form-error" role="alert" data-testid="signin-error">
      {t(errorKey, { length: codeLength })}
    </p>
  );

  return (
    <div className="sign-in">
      <section className="card sign-in-card">
        <h1 data-testid="signin-title">{t('signIn.title')}</h1>

        {step === 'email' ? (
          <form onSubmit={requestCode} noValidate>
            <p>{t('signIn.intro')}</p>
            <label className="field">
              <span className="field-label">{t('signIn.emailLabel')}</span>
              <input
                type="email"
                autoComplete="email"
                required
                data-testid="signin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {error}
            <button type="submit" className="button" data-testid="signin-request-code" disabled={busy}>
              {t('signIn.sendCode')}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} noValidate>
            <p data-testid="signin-code-sent">{t('signIn.codeSent', { length: SERVER_CODE_LENGTH, email })}</p>
            <label className="field">
              <span className="field-label">{t('signIn.codeLabel')}</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                data-testid="signin-code"
                maxLength={codeLength}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </label>
            {error}
            <button type="submit" className="button" data-testid="signin-verify" disabled={busy}>
              {t('signIn.verify')}
            </button>
            <div className="sign-in-links">
              <button type="button" className="link-button" data-testid="signin-resend" onClick={() => requestCode()}>
                {t('signIn.resend')}
              </button>
              <button
                type="button"
                className="link-button"
                data-testid="signin-change-email"
                onClick={() => {
                  setStep('email');
                  setErrorKey(null);
                  setInboxCode(null);
                }}
              >
                {t('signIn.changeEmail')}
              </button>
            </div>
          </form>
        )}
      </section>

      {step === 'code' && (
        <aside className="card dev-inbox" data-testid="dev-inbox" aria-labelledby="dev-inbox-title">
          <h2 id="dev-inbox-title">{t('devInbox.title')}</h2>
          <p>{t('devInbox.description')}</p>
          {inboxCode ? (
            <p className="dev-inbox-code" data-testid="dev-inbox-code">
              {inboxCode}
            </p>
          ) : (
            <p>{t('devInbox.waiting')}</p>
          )}
        </aside>
      )}
    </div>
  );
}
