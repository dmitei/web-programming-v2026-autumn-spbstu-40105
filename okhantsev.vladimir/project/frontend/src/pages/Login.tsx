import {useState, type FormEvent} from 'react';
import {Modal} from '../components/Modal';
import {useStore} from '../storeContext';

export function Login() {
  const {login} = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState<{
    username?: boolean;
    password?: boolean;
  }>({});
  const [showError, setShowError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: {username?: boolean; password?: boolean} = {};
    if (!username.trim()) {
      next.username = true;
    }
    if (!password) {
      next.password = true;
    }
    setInvalid(next);
    if (next.username || next.password) {
      return;
    }
    setBusy(true);
    try {
      await login(username.trim(), password);
    } catch {
      setShowError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth">
      <h1 className="page-title">Вход</h1>
      <form className="form" onSubmit={submit} noValidate>
        <label className="form-field">
          <span>Имя пользователя</span>
          <input
            className={invalid.username ? 'invalid' : ''}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setInvalid((prev) => ({...prev, username: false}));
            }}
            autoComplete="username"
          />
          {invalid.username && (
            <em className="form-field-error">Заполните обязательное поле</em>
          )}
        </label>
        <label className="form-field">
          <span>Пароль</span>
          <input
            type="password"
            className={invalid.password ? 'invalid' : ''}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setInvalid((prev) => ({...prev, password: false}));
            }}
            autoComplete="current-password"
          />
          {invalid.password && (
            <em className="form-field-error">Заполните обязательное поле</em>
          )}
        </label>
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? 'Вход…' : 'Войти'}
        </button>
      </form>

      {showError && (
        <Modal onClose={() => setShowError(false)} className="modal-small">
          <p className="confirm-text">
            Такого пользователя нет, возможно неправильный логин или пароль —
            проверьте данные.
          </p>
          <div className="confirm-actions">
            <button
              className="button primary"
              onClick={() => setShowError(false)}
            >
              Ок
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
