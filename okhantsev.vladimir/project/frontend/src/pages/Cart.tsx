import {useEffect, useMemo, useState, type FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {ApiError, createOrder, getOrders} from '../api';
import {Modal} from '../components/Modal';
import {useStore} from '../storeContext';
import type {DeliveryType, Order, PaymentType} from '../types';

type Tab = 'cart' | 'orders';

const EMPTY_FORM = {
  email: '',
  phone: '',
  deliveryType: 'delivery' as DeliveryType,
  address: '',
  paymentType: 'card' as PaymentType,
  needWrapping: false,
};

export function Cart() {
  const {goods, cart, setQuantity, removeFromCart, clearCart} = useStore();
  const [tab, setTab] = useState<Tab>('cart');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<
    number | 'selected' | null
  >(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [invalid, setInvalid] = useState<{
    phone?: boolean;
    address?: boolean;
  }>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [details, setDetails] = useState<Order | null>(null);

  const goodsById = useMemo(
    () => new Map(goods.map((g) => [g.id, g])),
    [goods],
  );
  const filled = cart.filter((item) => goodsById.has(item.productId));
  const total = filled.reduce(
    (sum, item) =>
      sum + (goodsById.get(item.productId)?.price ?? 0) * item.quantity,
    0,
  );

  const loadOrders = () => {
    getOrders()
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    if (tab === 'orders' && orders === null) {
      loadOrders();
    }
  }, [tab, orders]);

  const toggleSelected = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const confirmDelete = () => {
    if (pendingDelete === 'selected') {
      selected.forEach((id) => removeFromCart(id));
      setSelected(new Set());
    } else if (pendingDelete !== null) {
      removeFromCart(pendingDelete);
    }
    setPendingDelete(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: {phone?: boolean; address?: boolean} = {};
    if (!form.phone.trim()) {
      next.phone = true;
    }
    if (form.deliveryType === 'delivery' && !form.address.trim()) {
      next.address = true;
    }
    setInvalid(next);
    if (next.phone || next.address) {
      return;
    }
    setBusy(true);
    setSubmitError('');
    try {
      await createOrder({
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        deliveryType: form.deliveryType,
        address:
          form.deliveryType === 'delivery' ? form.address.trim() : undefined,
        paymentType: form.paymentType,
        needWrapping: form.needWrapping,
        items: filled.map((item) => ({
          goodId: item.productId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      setForm(EMPTY_FORM);
      setSelected(new Set());
      setSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Не удалось оформить заказ, попробуйте ещё раз.',
      );
    } finally {
      setBusy(false);
    }
  };

  const resetInvalid = (field: 'phone' | 'address') => {
    setInvalid((prev) => ({...prev, [field]: false}));
  };

  return (
    <section>
      <h1 className="page-title">Заказы</h1>

      <div className="tabs">
        <button
          className={`tabs-tab${tab === 'cart' ? ' tabs-tab-active' : ''}`}
          onClick={() => setTab('cart')}
        >
          Корзина
        </button>
        <button
          className={`tabs-tab${tab === 'orders' ? ' tabs-tab-active' : ''}`}
          onClick={() => setTab('orders')}
        >
          История заказов
        </button>
      </div>

      {tab === 'cart' ? (
        success ? (
          <p className="cart-success">Спасибо, ваш заказ успешно оформлен.</p>
        ) : filled.length === 0 ? (
          <p className="cart-empty">
            Ознакомьтесь с новинками и хитами на&nbsp;главной или найдите нужное
            в <Link to="/catalog">каталоге</Link>.
          </p>
        ) : (
          <>
            <div className="cart-toolbar">
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={selected.size === filled.length}
                  onChange={() =>
                    setSelected(
                      selected.size === filled.length
                        ? new Set()
                        : new Set(filled.map((i) => i.productId)),
                    )
                  }
                />
                Выбрать все
              </label>
              <button
                className="button"
                disabled={selected.size === 0}
                onClick={() => setPendingDelete('selected')}
              >
                Удалить выбранные ({selected.size})
              </button>
            </div>

            <div className="cart-list">
              {filled.map((item) => {
                const product = goodsById.get(item.productId)!;
                return (
                  <div className="cart-item" key={item.productId}>
                    <label className="form-check cart-item-check">
                      <input
                        type="checkbox"
                        checked={selected.has(item.productId)}
                        onChange={() => toggleSelected(item.productId)}
                      />
                    </label>
                    {product.photo && (
                      <img
                        className="cart-item-img"
                        src={product.photo}
                        alt={product.name}
                      />
                    )}
                    <span className="cart-item-name">{product.name}</span>
                    <div className="stepper">
                      <button
                        className="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="stepper-qty">{item.quantity}</span>
                      <button
                        className="button"
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">
                      {(product.price * item.quantity).toLocaleString('ru-RU')}{' '}
                      ₽
                    </span>
                    <button
                      className="cart-item-remove"
                      onClick={() => setPendingDelete(item.productId)}
                    >
                      Удалить
                    </button>
                  </div>
                );
              })}
            </div>

            <form className="order-form" onSubmit={submit} noValidate>
              <h2 className="order-form-title">Оформление заказа</h2>

              <div className="order-form-row">
                <label className="form-field">
                  <span>Телефон</span>
                  <input
                    className={invalid.phone ? 'invalid' : ''}
                    value={form.phone}
                    onChange={(e) => {
                      setForm({...form, phone: e.target.value});
                      resetInvalid('phone');
                    }}
                    placeholder="+7 900 000-00-00"
                    autoComplete="tel"
                  />
                  {invalid.phone && (
                    <em className="form-field-error">
                      Заполните обязательное поле
                    </em>
                  )}
                </label>
                <label className="form-field">
                  <span>Почта (необязательно)</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="you@mail.ru"
                    autoComplete="email"
                  />
                </label>
              </div>

              <div className="radio-group">
                <label className="form-check">
                  <input
                    type="radio"
                    name="delivery"
                    checked={form.deliveryType === 'delivery'}
                    onChange={() =>
                      setForm({...form, deliveryType: 'delivery'})
                    }
                  />
                  Доставка
                </label>
                <label className="form-check">
                  <input
                    type="radio"
                    name="delivery"
                    checked={form.deliveryType === 'pickup'}
                    onChange={() => setForm({...form, deliveryType: 'pickup'})}
                  />
                  Самовывоз
                </label>
              </div>

              {form.deliveryType === 'delivery' && (
                <label className="form-field">
                  <span>Адрес</span>
                  <input
                    className={invalid.address ? 'invalid' : ''}
                    value={form.address}
                    onChange={(e) => {
                      setForm({...form, address: e.target.value});
                      resetInvalid('address');
                    }}
                    placeholder="Город, улица, дом, квартира"
                    autoComplete="street-address"
                  />
                  {invalid.address && (
                    <em className="form-field-error">
                      Заполните обязательное поле
                    </em>
                  )}
                </label>
              )}

              <div className="order-form-row">
                <label className="form-field">
                  <span>Оплата</span>
                  <select
                    value={form.paymentType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentType: e.target.value as PaymentType,
                      })
                    }
                  >
                    <option value="card">По карте</option>
                    <option value="cash">Наличными</option>
                  </select>
                </label>
              </div>

              <label className="form-check">
                <input
                  type="checkbox"
                  checked={form.needWrapping}
                  onChange={(e) =>
                    setForm({...form, needWrapping: e.target.checked})
                  }
                />
                Нужна упаковка
              </label>

              <div className="order-form-total">
                Итого: {total.toLocaleString('ru-RU')} ₽
              </div>

              {submitError && <p className="form-error">{submitError}</p>}

              <button className="button primary" type="submit" disabled={busy}>
                {busy ? 'Оформляем…' : 'Оформить заказ'}
              </button>
            </form>
          </>
        )
      ) : (
        <div className="orders-list">
          {orders === null ? (
            <p>Загрузка…</p>
          ) : orders.length === 0 ? (
            <p className="cart-empty">Вы пока не оформили ни одного заказа.</p>
          ) : (
            orders.map((order, i) => (
              <div className="order-row" key={order.id}>
                <span className="order-row-num">{i + 1}</span>
                <span className="order-row-date">
                  {new Date(order.date).toLocaleString('ru-RU')}
                </span>
                <span className="order-row-total">
                  {order.totalPrice.toLocaleString('ru-RU')} ₽
                </span>
                <button
                  className="order-row-details"
                  onClick={() => setDetails(order)}
                >
                  Детали
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {details && (
        <Modal onClose={() => setDetails(null)} className="modal-small">
          <h2 className="order-details-title">Заказ №{details.id}</h2>
          <p className="order-details-date">
            {new Date(details.date).toLocaleString('ru-RU')}
          </p>
          <ul className="order-details-list">
            {details.items.map((item, idx) => {
              const product = goodsById.get(item.goodId);
              return (
                <li key={idx}>
                  {product ? product.name : `Товар #${item.goodId}`} ×{' '}
                  {item.quantity}
                </li>
              );
            })}
          </ul>
          <div className="order-details-total">
            Итого: {details.totalPrice.toLocaleString('ru-RU')} ₽
          </div>
        </Modal>
      )}

      {pendingDelete !== null && (
        <Modal onClose={() => setPendingDelete(null)} className="modal-small">
          <p className="confirm-text">Вы уверены, что хотите удалить?</p>
          <div className="confirm-actions">
            <button className="button primary" onClick={confirmDelete}>
              Удалить
            </button>
            <button className="button" onClick={() => setPendingDelete(null)}>
              Отмена
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
