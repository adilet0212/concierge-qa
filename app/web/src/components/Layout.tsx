import type { ReactNode } from 'react';
import { getEnabledBugs } from '../../../shared/seeded-bugs.ts';
import { useI18n } from '../i18n.tsx';
import { Header } from './Header.tsx';

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const bugCount = getEnabledBugs().length;

  return (
    <>
      <a className="skip-link" href="#main">
        {t('nav.skipToContent')}
      </a>
      <Header />
      <main id="main" className="page" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <p>{t('footer.disclaimer')}</p>
        {bugCount > 0 && (
          <p className="bug-banner" data-testid="bug-mode-banner">
            {t('footer.bugMode', { count: bugCount })}
          </p>
        )}
      </footer>
    </>
  );
}
