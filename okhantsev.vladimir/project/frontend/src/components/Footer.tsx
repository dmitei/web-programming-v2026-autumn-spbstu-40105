const SOCIALS = [
  {
    href: 'https://t.me/',
    src: '/images/social/telegram.png',
    alt: 'Telegram',
  },
  {href: 'https://vk.com/', src: '/images/social/vk.png', alt: 'ВКонтакте'},
  {
    href: 'https://wa.me/',
    src: '/images/social/whatsapp.png',
    alt: 'WhatsApp',
  },
];

const PHONES = ['8 (800) 678-34-24'];

const ADDRESSES: {href?: string; label: string}[] = [
  {label: 'gadget@hub.ru'},
  {label: 'Санкт-Петербург, ул. Барочная, д.7, корпус 2'},
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cols">
        <div className="footer-brand">
          <span className="footer-logo">Gadget Hub</span>
          <span className="footer-tagline">Магазин надежных гаджетов</span>
        </div>
        <div className="footer-addresses">
          {ADDRESSES.map((a) =>
            a.href ? (
              <a key={a.label} className="footer-item" href={a.href}>
                {a.label}
              </a>
            ) : (
              <span key={a.label} className="footer-item">
                {a.label}
              </span>
            ),
          )}
        </div>
        <div className="footer-messengers">
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.alt}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.alt}
                title={s.alt}
              >
                <img src={s.src} alt={s.alt} />
              </a>
            ))}
          </div>
          <div className="footer-phones">
            {PHONES.map((p) => (
              <span key={p} className="footer-item">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="footer-copy">© 2026 ООО “Гаджет Хаб”. Все права защищены</p>
    </footer>
  );
}
