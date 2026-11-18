import {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {Carousel} from '../components/Carousel';
import {SimpleCard} from '../components/SimpleCard';
import {useStore} from '../storeContext';

export function Home() {
  const {goods, authenticated} = useStore();
  const navigate = useNavigate();

  const openInCatalog = (product: {id: number}) => {
    if (!authenticated) {
      navigate('/login');
      return;
    }
    navigate('/catalog', {state: {openProductId: product.id}});
  };

  const hits = useMemo(() => goods.filter((g) => g.isHit), [goods]);
  const news = useMemo(() => goods.filter((g) => g.isNew), [goods]);

  const advantages = [
    {
      title: 'Доставка в день заказа',
      text: 'Привезём заказ уже сегодня, если оформите до 17:00.',
    },
    {
      title: 'Оригинальные товары',
      text: 'Вся техника официальная, с полной гарантией производителя.',
    },
    {
      title: 'Возврат без вопросов',
      text: '14 дней на возврат товара, если он вам не подошёл.',
    },
  ];

  return (
    <section className="home">
      <div className="hero">
        <h1 className="hero-title">Gadget Hub</h1>
        <p className="hero-subtitle">
          Магазин умной техники: смартфоны, часы, наушники и аксессуары.
        </p>
      </div>

      <Carousel title="Хиты продаж">
        {hits.map((product) => (
          <SimpleCard
            key={product.id}
            product={product}
            onOpen={openInCatalog}
          />
        ))}
      </Carousel>

      <Carousel title="Новинки">
        {news.map((product) => (
          <SimpleCard
            key={product.id}
            product={product}
            onOpen={openInCatalog}
          />
        ))}
      </Carousel>

      <div className="advantages">
        {advantages.map((a) => (
          <div className="advantage" key={a.title}>
            <h3 className="advantage-title">{a.title}</h3>
            <p className="advantage-text">{a.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
