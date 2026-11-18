import type {ReactNode} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useStore} from '../storeContext';
import {Footer} from './Footer';
import {Header} from './Header';

export function Layout() {
  const {goodsLoading, goodsError, reloadGoods} = useStore();

  return (
    <div className="layout">
      <div className="layout-container">
        <Header />
        {goodsError && (
          <div className="banner banner-error" role="alert">
            <span>{goodsError}</span>
            <button className="button secondary" onClick={reloadGoods}>
              Повторить
            </button>
          </div>
        )}
        <main className="main">
          {goodsLoading ? <p>Загрузка…</p> : <Outlet />}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export function Protected({children}: {children?: ReactNode}) {
  const {authenticated} = useStore();
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" replace state={{from: location.pathname}} />;
  }

  return children ?? <Outlet />;
}

export function RedirectIfAuthed({children}: {children?: ReactNode}) {
  const {authenticated} = useStore();
  return authenticated ? <Navigate to="/" replace /> : (children ?? <Outlet />);
}
