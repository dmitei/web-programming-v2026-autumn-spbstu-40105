import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

const PER_VIEW = 4;
const EASING = 0.09;
const SETTLED = 0.003;

export function Carousel({
  title,
  children,
}: {
  title: string;
  children: ReactNode[];
}) {
  const slides = useMemo(() => children.filter((c) => c !== null), [children]);
  const count = slides.length;
  const canScroll = count > PER_VIEW;

  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);

  const applyTransform = () => {
    const track = trackRef.current;
    if (!track || count === 0) {
      return;
    }
    const wrapped = canScroll
      ? ((positionRef.current % count) + count) % count
      : 0;
    track.style.transform = `translateX(-${wrapped * (100 / PER_VIEW)}%)`;
  };

  useLayoutEffect(applyTransform);

  useEffect(
    () => () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    [],
  );

  if (count === 0) {
    return null;
  }

  const tick = () => {
    const diff = targetRef.current - positionRef.current;
    if (Math.abs(diff) < SETTLED) {
      positionRef.current = targetRef.current;
      applyTransform();
      rafRef.current = 0;
      return;
    }
    positionRef.current += diff * EASING;
    applyTransform();
    rafRef.current = requestAnimationFrame(tick);
  };

  const move = (dir: 1 | -1) => {
    if (!canScroll) {
      return;
    }
    targetRef.current += dir;
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const rendered = canScroll ? [...slides, ...slides] : slides;

  return (
    <div className="carousel">
      <div className="carousel-head">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-arrows">
          <button
            className="carousel-arrow"
            onClick={() => move(-1)}
            aria-label="Назад"
            disabled={!canScroll}
          >
            ←
          </button>
          <button
            className="carousel-arrow"
            onClick={() => move(1)}
            aria-label="Вперёд"
            disabled={!canScroll}
          >
            →
          </button>
        </div>
      </div>
      <div className="carousel-viewport">
        <div className="carousel-track" ref={trackRef}>
          {rendered.map((slide, i) => (
            <div className="carousel-slide" key={i}>
              {slide}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
