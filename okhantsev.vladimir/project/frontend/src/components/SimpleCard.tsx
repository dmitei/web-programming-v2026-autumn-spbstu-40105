import {useStore} from '../storeContext';
import type {Product} from '../types';
import {CartControl} from './CartControl';

export function SimpleCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen?: (product: Product) => void;
}) {
  const {name, price, rating, photo} = product;
  const {authenticated} = useStore();

  return (
    <div
      className={`simple-card${onOpen ? ' simple-card-clickable' : ''}`}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={() => onOpen?.(product)}
      onKeyDown={(e) => {
        if (onOpen && e.key === 'Enter') {
          onOpen(product);
        }
      }}
    >
      {photo && (
        <img
          className="simple-card-img"
          src={photo}
          alt={name}
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <div className="simple-card-info">
        <h3 className="simple-card-title">{name}</h3>
        <div className="simple-card-bottom">
          <span className="simple-card-price">
            {price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="simple-card-rating">★ {rating.toFixed(1)}</span>
        </div>
        {authenticated && (
          <div
            className="simple-card-cart"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <CartControl
              productId={product.id}
              stepperClassName="simple-card-stepper"
            />
          </div>
        )}
      </div>
    </div>
  );
}
