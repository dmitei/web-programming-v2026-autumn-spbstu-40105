export function PriceRange({
  min,
  max,
  from,
  to,
  onChange,
}: {
  min: number;
  max: number;
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
}) {
  const span = max - min || 1;
  const fromPct = ((from - min) / span) * 100;
  const toPct = ((to - min) / span) * 100;

  return (
    <div className="filters-range">
      <div className="filters-range-track" />
      <div
        className="filters-range-fill"
        style={{
          left: `calc(8px + (100% - 16px) * ${fromPct / 100})`,
          right: `calc(8px + (100% - 16px) * ${(100 - toPct) / 100})`,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={from}
        onChange={(e) => onChange(Math.min(Number(e.target.value), to), to)}
        style={{zIndex: fromPct > 50 ? 3 : 1}}
        aria-label="Цена от"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={to}
        onChange={(e) => onChange(from, Math.max(Number(e.target.value), from))}
        style={{zIndex: 2}}
        aria-label="Цена до"
      />
    </div>
  );
}
