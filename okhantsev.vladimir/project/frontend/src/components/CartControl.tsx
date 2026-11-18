import {useStore} from '../storeContext';

export function CartControl({
  productId,
  stepperClassName,
}: {
  productId: number;
  stepperClassName?: string;
}) {
  const {cart, addToCart, setQuantity} = useStore();
  const qty = cart.find((item) => item.productId === productId)?.quantity ?? 0;

  if (qty === 0) {
    return (
      <button className="button primary" onClick={() => addToCart(productId)}>
        В корзину
      </button>
    );
  }

  return (
    <div
      className={stepperClassName ? `stepper ${stepperClassName}` : 'stepper'}
    >
      <button
        className="button"
        onClick={() => setQuantity(productId, qty - 1)}
      >
        −
      </button>
      <span className="stepper-qty">{qty}</span>
      <button
        className="button"
        onClick={() => setQuantity(productId, qty + 1)}
      >
        +
      </button>
    </div>
  );
}
