import {Navigate, Route, Routes} from 'react-router-dom';
import {Layout, Protected, RedirectIfAuthed} from './components/Layout';
import {Cart} from './pages/Cart';
import {Catalog} from './pages/Catalog';
import {Home} from './pages/Home';
import {Login} from './pages/Login';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/catalog"
          element={
            <Protected>
              <Catalog />
            </Protected>
          }
        />
        <Route
          path="/cart"
          element={
            <Protected>
              <Cart />
            </Protected>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
