import { useI18n } from '../i18n.tsx';
import { Link } from '../router.tsx';

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className="page-message">
      <h1 data-testid="not-found-title">{t('common.notFound.title')}</h1>
      <p>{t('common.notFound.body')}</p>
      <Link to="/">{t('common.backHome')}</Link>
    </section>
  );
}
