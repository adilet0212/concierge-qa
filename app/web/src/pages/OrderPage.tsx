import { ORDER_STATUSES, type Order, type Property } from '../../../shared/types.ts';
import { useApi } from '../api.ts';
import { BackLink, LoadError, Loading, Money, StatusTimeline } from '../components/common.tsx';
import { useI18n } from '../i18n.tsx';
import { Link } from '../router.tsx';

const POLL_MS = 1500;

export function OrderPage({ orderId }: { orderId: string }) {
  const { t, localized } = useI18n();
  // The kitchen updates the status from its own tablet, so this page polls for changes
  // until the order is delivered.
  const { data: order, error } = useApi<Order>(`/api/orders/${orderId}`, POLL_MS);
  const { data: property } = useApi<Property>(order ? `/api/properties/${order.propertyId}` : null);

  if (error) return <LoadError error={error} />;
  if (!order || !property) return <Loading />;

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <section className="card">
        <h1 data-testid="order-title" data-order-number={order.number}>
          {t('order.title', { number: order.number })}
        </h1>
        <p className="order-status-line">
          {t('order.statusLabel')}:{' '}
          <strong data-testid="order-status" data-status={order.status}>
            {t(`order.status.${order.status}`)}
          </strong>
        </p>
        <StatusTimeline steps={ORDER_STATUSES} current={order.status} labelPrefix="order.status." testIdPrefix="order-step" />
      </section>

      <section className="card" aria-labelledby="order-items">
        <h2 id="order-items">{t('order.items')}</h2>
        <ul className="cart-lines">
          {order.lines.map((line) => (
            <li key={line.menuItemId} className="cart-line" data-testid={`order-line-${line.menuItemId}`}>
              <span className="cart-line-name">
                {line.quantity} × {localized(line.name)}
              </span>
              <Money amount={line.price * line.quantity} currency={order.currency} />
            </li>
          ))}
        </ul>
        <p className="price-total-line">
          {t('dining.total')}: <Money testId="order-total" amount={order.totals.total} currency={order.currency} />
        </p>
        <Link to={`/properties/${property.id}/dining`} data-testid="order-more">
          {t('order.orderMore')}
        </Link>
      </section>
    </>
  );
}
