import {useEffect, useMemo, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {
  applyFilters,
  CRITERIA,
  DEFAULT_FILTERS,
  DIRECTIONS,
  PAGE_SIZE,
  pageNumbers,
  sortGoods,
  type Filters,
  type SortCriterion,
  type SortDirection,
} from '../catalogUtils';
import {CatalogFilters} from '../components/CatalogFilters';
import {ProductCard} from '../components/ProductCard';
import {ProductModal} from '../components/ProductModal';
import {colorLabel, typeLabel} from '../normalize';
import {useStore} from '../storeContext';
import type {Product} from '../types';

export function Catalog() {
  const {goods} = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const priceBounds = useMemo(() => {
    let min = Infinity;
    let max = 0;
    for (const g of goods) {
      if (g.price < min) {
        min = g.price;
      }
      if (g.price > max) {
        max = g.price;
      }
    }
    return {min: min === Infinity ? 0 : min, max};
  }, [goods]);

  const boundsDefaults = (): Filters => ({
    ...DEFAULT_FILTERS,
    priceFrom: String(priceBounds.min),
    priceTo: String(priceBounds.max),
  });

  const [draft, setDraft] = useState<Filters>(boundsDefaults);
  const [filters, setFilters] = useState<Filters>(boundsDefaults);
  const [criterion, setCriterion] = useState<SortCriterion>('new');
  const [direction, setDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);

  const typeOptions = useMemo(
    () => [...new Set(goods.map((g) => typeLabel(g.type)))],
    [goods],
  );
  const colorOptions = useMemo(
    () => [...new Set(goods.flatMap((g) => g.colors ?? []).map(colorLabel))],
    [goods],
  );

  const visible = useMemo(
    () => sortGoods(applyFilters(goods, filters), criterion, direction),
    [goods, filters, criterion, direction],
  );

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const pageItems = visible.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetFilters = () => {
    const defaults = boundsDefaults();
    setDraft(defaults);
    setFilters(defaults);
    setPage(1);
  };

  useEffect(() => {
    const openProductId = (location.state as {openProductId?: number} | null)
      ?.openProductId;
    if (openProductId === undefined) {
      return;
    }
    const product = goods.find((g) => g.id === openProductId);
    if (product) {
      setSelected(product);
    }
    navigate('/catalog', {replace: true, state: null});
  }, [goods, location.state, navigate]);

  return (
    <section>
      <h1 className="page-title">Каталог</h1>

      <div className="catalog-layout">
        <div>
          <div className="sort-bar">
            <span className="sort-bar-label">Сортировать:</span>
            <select
              className="sort-bar-select"
              value={criterion}
              onChange={(e) => {
                setCriterion(e.target.value as SortCriterion);
                setPage(1);
              }}
            >
              {CRITERIA.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              className="sort-bar-select"
              value={direction}
              onChange={(e) => {
                setDirection(e.target.value as SortDirection);
                setPage(1);
              }}
            >
              {DIRECTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {pageItems.length === 0 ? (
            <p className="catalog-empty">
              По заданным фильтрам ничего не найдено.
            </p>
          ) : (
            <div className="catalog-grid">
              {pageItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={setSelected}
                />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="pagination">
              {pageNumbers(pages, currentPage).map((n, i) =>
                n === '…' ? (
                  <span key={i} className="pagination-dots">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    className={`pagination-btn${
                      n === currentPage ? ' pagination-btn-active' : ''
                    }`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        <CatalogFilters
          draft={draft}
          setDraft={setDraft}
          priceBounds={priceBounds}
          typeOptions={typeOptions}
          colorOptions={colorOptions}
          onShow={() => {
            setFilters(draft);
            setPage(1);
          }}
          onReset={resetFilters}
        />
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
