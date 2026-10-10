import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Guest } from '../../shared/types.ts';
import { api, getToken, setToken } from './api.ts';

type Status = 'loading' | 'signedIn' | 'signedOut';

interface SessionValue {
  status: Status;
  guest: Guest | null;
  signIn(token: string, guest: Guest): void;
  signOut(): Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

// The session token is kept in localStorage, so a signed-in guest stays signed in after a reload.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>(getToken() ? 'loading' : 'signedOut');
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    if (!getToken()) return;
    api<Guest>('GET', '/api/me')
      .then((me) => {
        setGuest(me);
        setStatus('signedIn');
      })
      .catch(() => {
        // Expired or revoked token: start again from the sign-in page.
        setToken(null);
        setStatus('signedOut');
      });
  }, []);

  const value: SessionValue = {
    status,
    guest,
    signIn(token, signedInGuest) {
      setToken(token);
      setGuest(signedInGuest);
      setStatus('signedIn');
    },
    async signOut() {
      await api('POST', '/api/auth/sign-out').catch(() => undefined);
      setToken(null);
      setGuest(null);
      setStatus('signedOut');
    },
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside <SessionProvider>');
  return session;
}
