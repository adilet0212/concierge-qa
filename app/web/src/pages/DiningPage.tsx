import { useEffect, useRef, useState } from 'react';
import { diningTotals } from '../../../shared/pricing.ts';
import { isBugOn } from '../../../shared/seeded-bugs.ts';
import type { Order, Property } from '../../../shared/types.ts';
import { api, uniqueId, useApi } from '../api.ts';
import { BackLink, LoadError, Loading, Money } from '../components/common.tsx';
import { formatPercent } from '../format.ts';
import { useI18n } from '../i18n.tsx';
import { navigate } from '../router.tsx';

type Cart = Record<string, number>; // menu item id -> quantity

export function DiningPage({ propertyId }: { propertyId: string }) {
  const { t, locale, localized } = useI18n();
  const { data: property, error } = useApi<Property>(`/api/properties/${propertyId}`);
  const [cart, setCart] = useState<Cart>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  // Double-submit protection, part 1: a ref changes instantly (state only changes on the next
  // render), so a second click in the same instant still sees "already submitting".
  const submittingRef = useRef(false);
  // Part 2: one idempotency key per cart. If the same order is sent twice, the server returns
  // the first order instead of creating another one. A new cart gets a new key.
  const idempotencyKey = useRef(uniqueId());
  useEffect(() => {
    idempotencyKey.current = uniqueId();
  }, [cart]);

  if (error) return <LoadError error={error} />;
  if (!property) return <Loading />;

  const lines = property.menu
    .filter((dish) => cart[dish.id] > 0)
    .map((dish) => ({ dish, price: dish.price, quantity: cart[dish.id] }));
  const totals = diningTotals(lines, property.diningTaxRate, property.serviceChargeRate);

  function changeQuantity(dishId: string, change: number) {
    setCart((current) => ({ ...current, [dishId]: Math.max(0, (current[dishId] ?? 0) + change) }));
  }

  async function placeOrder() {
    // SEEDED BUG #5: the fixed version ignores a second click while an order is being placed
    // (ref guard + disabled button) and reuses the cart's idempotency key. The buggy version
    // has no guard and sends a fresh key on every click, so a double-click creates two orders.
    const guardAgainstDoubleSubmit = !isBugOn(5);
    if (guardAgainstDoubleSubmit) {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
    }
    setFailed(false);

    try {
      const order = await api<Order>('POST', '/api/orders', {
        propertyId: property!.id,
        items: lines.map((line) => ({ menuItemId: line.dish.id, quantity: line.quantity })),
        idempotencyKey: guardAgainstDoubleSubmit ? idempotencyKey.current : uniqueId(),
      });
      navigate(`/orders/${order.id}`);
    } catch {
      setFailed(true);
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <>
      <BackLink to={`/properties/${property.id}`} label={t('common.backTo', { name: property.name })} />
      <h1 data-testid="dining-title">{t('dining.title', { name: property.name })}</h1>

      <div className="dining-layout">
        <section aria-labelledby="menu-title">
          <h2 id="menu-title">{t('dining.menu')}</h2>
          <ul className="menu-list">
            {property.menu.map((dish) => (
              <li key={dish.id} className="card menu-item" data-testid={`menu-item-${dish.id}`}>
                <span className="menu-item-name">{localized(dish.name)}</span>
                <Money amount={dish.price} currency={property.currency} testId={`menu-price-${dish.id}`} />
                <button
                  type="button"
                  className="button button-small"
                  data-testid={`add-${dish.id}`}
                  aria-label={t('dining.addLabel', { dish: localized(dish.name) })}
                  onClick={() => changeQuantity(dish.id, 1)}
                >
                  {t('dining.add')}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card cart" aria-labelledby="cart-title" data-testid="cart">
          <h2 id="cart-title">{t('dining.cart')}</h2>
          {lines.length === 0 ? (
            <p data-testid="cart-empty">{t('dining.cartEmpty')}</p>
          ) : (
            <ul className="cart-lines">
              {lines.map(({ dish, quantity }) => (
                <li key={dish.id} className="cart-line" data-testid={`cart-line-${dish.id}`}>
                  <span className="cart-line-name">{localized(dish.name)}</span>
                  <span className="stepper">
                    <button
                      type="button"
                      data-testid={`cart-decrease-${dish.id}`}
                      aria-label={t('dining.decrease', { dish: localized(dish.name) })}
                      onClick={() => changeQuantity(dish.id, -1)}
                    >
                      −
                    </button>
                    <span data-testid={`cart-qty-${dish.id}`} aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      data-testid={`cart-increase-${dish.id}`}
                      aria-label={t('dining.increase', { dish: localized(dish.name) })}
                      onClick={() => changeQuantity(dish.id, 1)}
                    >
                      +
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <dl className="price-summary">
            <div>
              <dt>{t('dining.subtotal')}</dt>
              <dd>
                <Money testId="cart-subtotal" amount={totals.subtotal} currency={property.currency} />
              </dd>
            </div>
            <div>
              <dt>{t('dining.tax', { rate: formatPercent(property.diningTaxRate, locale) })}</dt>
              <dd>
                <Money testId="cart-tax" amount={totals.tax} currency={property.currency} />
              </dd>
            </div>
            <div>
              <dt>{t('dining.service', { rate: formatPercent(property.serviceChargeRate, locale) })}</dt>
              <dd>
                <Money testId="cart-service" amount={totals.serviceCharge} currency={property.currency} />
              </dd>
            </div>
            <div className="price-total">
              <dt>{t('dining.total')}</dt>
              <dd>
                <Money testId="cart-total" amount={totals.total} currency={property.currency} />
              </dd>
            </div>
          </dl>

          {failed && (
            <p className="form-error" role="alert" data-testid="order-error">
              {t('common.error')}
            </p>
          )}
          <button
            type="button"
            className="button"
            data-testid="place-order"
            disabled={lines.length === 0 || submitting}
            onClick={placeOrder}
          >
            {submitting ? t('dining.placingOrder') : t('dining.placeOrder')}
          </button>
        </section>
      </div>
    </>
  );
}
