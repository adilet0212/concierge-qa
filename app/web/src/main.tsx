import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setEnabledBugs } from '../../shared/seeded-bugs.ts';
import { App } from './App.tsx';
import { I18nProvider } from './i18n.tsx';
import { SessionProvider } from './session.tsx';
import './styles.css';

// Ask the server which seeded bugs are on (BUG_MODE) before the first render,
// so the browser-side bugs switch on and off together with the server-side ones.
async function start() {
  try {
    const config = await fetch('/api/config').then((response) => response.json());
    setEnabledBugs(config.seededBugs ?? []);
  } catch {
    setEnabledBugs([]);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <I18nProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </I18nProvider>
    </StrictMode>,
  );
}

start();
