import {colorLabel, typeLabel} from '../normalize';
import {useStore} from '../storeContext';
import type {Product} from '../types';
import {CartControl} from './CartControl';
import {Modal} from './Modal';

function normalizeCharValue(key: string, value: string): string {
  if (/тип/i.test(key)) {
    return typeLabel(value);
  }
  if (/цвет/i.test(key)) {
    return colorLabel(value);
  }
  return value;
}

export function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const {cart} = useStore();
  const qty = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
  const chars = product.characteristics
    ? Object.entries(product.characteristics)
    : [];

  return (
    <Modal onClose={onClose}>
      <div className="product-modal">
        {product.photo && (
          <img
            className="product-modal-img"
            src={product.photo}
            alt={product.name}
          />
        )}
        <div>
          {(product.isNew || product.isHit) && (
            <div className="product-modal-labels">
              {product.isNew && (
                <span className="badge badge-new">Новинка</span>
              )}
              {product.isHit && <span className="badge badge-hit">Хит</span>}
            </div>
          )}
          <h2 className="product-modal-title">{product.name}</h2>
          <div className="product-modal-rating">
            ★ {product.rating.toFixed(1)} / 5
          </div>
          <div className="product-modal-price">
            {product.price.toLocaleString('ru-RU')} ₽
          </div>
          {product.description && (
            <p className="product-modal-desc">{product.description}</p>
          )}
          {chars.length > 0 && (
            <ul className="product-modal-chars">
              {chars.map(([key, value]) => (
                <li key={key}>
                  <span>{key}</span>
                  <b>{normalizeCharValue(key, value)}</b>
                </li>
              ))}
            </ul>
          )}
          <div className="product-modal-cart">
            <CartControl productId={product.id} />
            {qty > 0 && (
              <span className="product-modal-incart">В корзине: {qty} шт.</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
