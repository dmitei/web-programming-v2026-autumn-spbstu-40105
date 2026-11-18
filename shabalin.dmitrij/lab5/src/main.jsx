import React, {createContext, useContext, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const ThemeContext = createContext(null);

const books = [
  {title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: '649 ₽'},
  {
    title: 'Пикник на обочине',
    author: 'Аркадий и Борис Стругацкие',
    price: '529 ₽',
  },
  {title: 'Маленький принц', author: 'Антуан де Сент-Экзюпери', price: '459 ₽'},
];

function ThemeButton() {
  const {theme, toggleTheme} = useContext(ThemeContext);

  return (
    <button type="button" data-testid="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '☾ Тёмная тема' : '☀ Светлая тема'}
    </button>
  );
}

function BookStore() {
  const {theme} = useContext(ThemeContext);

  return (
    <main data-testid="app" className="store" data-theme={theme}>
      <div className="container">
        <header>
          <h1>Книжный магазин</h1>
          <ThemeButton />
        </header>
        <ul className="books" data-testid="book-list">
          {books.map(({title, author, price}) => (
            <li key={title}>
              <h2>{title}</h2>
              <p>{author}</p>
              <strong>{price}</strong>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function App() {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <BookStore />
    </ThemeContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
