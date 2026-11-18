import {colorLabel} from '../normalize';
import type {Product} from '../types';
import {CartControl} from './CartControl';

export function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const {id, name, price, rating, photo, colors, isHit, isNew} = product;

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onOpen(product);
        }
      }}
    >
      {isNew && <span className="card-badge card-badge-new">Новинка</span>}
      {isHit && <span className="card-badge card-badge-hit">Хит</span>}
      {photo && (
        <img
          className="card-img"
          src={photo}
          alt={name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <div className="card-info">
        <h3 className="card-title">{name}</h3>
        <div className="card-color">
          {colors?.slice(0, 3).map(colorLabel).join(', ')}
        </div>
        <div className="card-bottom">
          <span className="card-price">{price.toLocaleString('ru-RU')} ₽</span>
          <span className="card-rating">★ {rating.toFixed(1)}</span>
        </div>
        <div
          className="card-cart"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <CartControl productId={id} stepperClassName="card-stepper" />
        </div>
      </div>
    </div>
  );
}
