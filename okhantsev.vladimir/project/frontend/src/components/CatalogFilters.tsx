import {clampPrice, type Filters, type PriceBounds} from '../catalogUtils';
import {PriceRange} from './PriceRange';

function toggleIn(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export function CatalogFilters({
  draft,
  setDraft,
  priceBounds,
  typeOptions,
  colorOptions,
  onShow,
  onReset,
}: {
  draft: Filters;
  setDraft: (filters: Filters) => void;
  priceBounds: PriceBounds;
  typeOptions: string[];
  colorOptions: string[];
  onShow: () => void;
  onReset: () => void;
}) {
  const priceFromValue = clampPrice(
    draft.priceFrom,
    priceBounds.min,
    priceBounds,
  );
  const priceToValue = clampPrice(draft.priceTo, priceBounds.max, priceBounds);

  return (
    <aside className="filters">
      <div className="filters-panel">
        <h2 className="filters-title">Фильтры</h2>

        <div className="filters-block">
          <span className="filters-label">Цена, ₽</span>
          <div className="filters-price">
            <label className="filters-price-field">
              <span>От</span>
              <input
                type="number"
                min="0"
                value={draft.priceFrom}
                onChange={(e) =>
                  setDraft({...draft, priceFrom: e.target.value})
                }
              />
            </label>
            <label className="filters-price-field">
              <span>До</span>
              <input
                type="number"
                min="0"
                value={draft.priceTo}
                onChange={(e) => setDraft({...draft, priceTo: e.target.value})}
              />
            </label>
          </div>
          <PriceRange
            min={priceBounds.min}
            max={priceBounds.max}
            from={priceFromValue}
            to={priceToValue}
            onChange={(from, to) =>
              setDraft({
                ...draft,
                priceFrom: String(from),
                priceTo: String(to),
              })
            }
          />
        </div>

        <div className="filters-block">
          <span className="filters-label">Тип товара</span>
          <div className="filters-checks">
            {typeOptions.map((t) => (
              <label className="filters-check" key={t}>
                <input
                  type="checkbox"
                  checked={draft.types.has(t)}
                  onChange={() =>
                    setDraft({...draft, types: toggleIn(draft.types, t)})
                  }
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="filters-block">
          <span className="filters-label">Цвет</span>
          <div className="filters-checks">
            {colorOptions.map((c) => (
              <label className="filters-check" key={c}>
                <input
                  type="checkbox"
                  checked={draft.colors.has(c)}
                  onChange={() =>
                    setDraft({...draft, colors: toggleIn(draft.colors, c)})
                  }
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="filters-actions">
          <button className="button primary" onClick={onShow}>
            Показать
          </button>
          <button className="button" onClick={onReset}>
            Сбросить фильтры
          </button>
        </div>
      </div>
    </aside>
  );
}
