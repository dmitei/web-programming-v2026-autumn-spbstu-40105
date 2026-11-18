import {Link, NavLink} from 'react-router-dom';
import {useStore} from '../storeContext';

export function Header() {
  const {authenticated, user, logout, cart} = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img className="logo-img" src="/images/icons/mobile.svg" alt="" />
        Gadget Hub
      </Link>

      <nav className="nav">
        {authenticated && (
          <NavLink to="/catalog" className="nav-link">
            <img src="/images/icons/catalog.svg" alt="" />
            Каталог
          </NavLink>
        )}
        {authenticated && (
          <NavLink to="/cart" className="nav-link">
            <img src="/images/icons/card.svg" alt="" />
            Корзина
            {cartCount > 0 && (
              <span className="nav-link-badge">{cartCount}</span>
            )}
          </NavLink>
        )}
      </nav>

      <div className="header-auth">
        {authenticated ? (
          <>
            <span className="header-user">
              <img src="/images/icons/profile.svg" alt="" />
              {user?.username}
            </span>
            <button className="button secondary" onClick={() => void logout()}>
              Выйти
            </button>
          </>
        ) : (
          <Link to="/login" className="button secondary">
            <img src="/images/icons/profile.svg" alt="" />
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}
