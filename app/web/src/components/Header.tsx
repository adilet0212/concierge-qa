import { useEffect, useState } from 'react';
import { LOCALES, useI18n } from '../i18n.tsx';
import { Link, navigate, usePath } from '../router.tsx';
import { useSession } from '../session.tsx';

// On wide screens the menu items sit in the header bar. On phones they collapse behind a
// "menu" button. The button is always in the DOM and CSS hides it on wide screens.
export function Header() {
  const { t, locale, setLocale } = useI18n();
  const { status, guest, signOut } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePath();

  useEffect(() => setMenuOpen(false), [path]);

  async function handleSignOut() {
    await signOut();
    navigate('/sign-in');
  }

  return (
    <header className="site-header">
      <div className="header-bar">
        <Link to="/" className="brand" data-testid="brand-home">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span className="brand-text">
            <span className="brand-name">{t('brand.name')}</span>
            <span className="brand-demo">{t('brand.demo')}</span>
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          data-testid="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="header-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">☰</span> {t('header.menu')}
        </button>

        <div id="header-menu" className={menuOpen ? 'header-menu is-open' : 'header-menu'} data-testid="header-menu">
          <label className="language-picker">
            <span>{t('header.language')}</span>
            <select data-testid="language-select" value={locale} onChange={(event) => setLocale(event.target.value)}>
              {LOCALES.map((option) => (
                <option key={option.code} value={option.code} lang={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {status === 'signedIn' && guest && (
            <>
              <span className="guest-email" data-testid="header-guest-email">
                {guest.email}
              </span>
              <button type="button" className="button button-quiet" data-testid="signout-button" onClick={handleSignOut}>
                {t('header.signOut')}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
