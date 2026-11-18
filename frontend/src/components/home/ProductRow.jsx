import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useDragScroll } from '../../hooks/useDragScroll';

export default function ProductRow({
  title,
  subtitle,
  query = 'page_size=12&ordering=-created_at',
  viewAllTo = '/category/all',
  accent = 'bg-rose-500',
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, handlers } = useDragScroll({ speed: 1.5 });

  useEffect(() => {
    api
      .get(`/products/?${query}`)
      .then((data) => setProducts(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const scrollBy = (dir) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-1.5 h-6 rounded-full ${accent} shrink-0`} />
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            aria-label="Scroll right"
          >
            ›
          </button>
          <Link
            to={viewAllTo}
            className="text-xs sm:text-sm font-medium text-brand-blue hover:underline ml-1"
          >
            View all
          </Link>
        </div>
      </div>

      <div
        ref={ref}
        {...handlers}
        className="
        flex gap-3 overflow-x-auto p-4 sm:p-5
        cursor-grab
        select-none
        scroll-smooth
        [-ms-overflow-style:none] [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
        "
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
      >
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-40 sm:w-44 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse aspect-[3/4]"
              />
            ))
          : products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                draggable={false}
                className="
                  w-40 sm:w-44 shrink-0 group rounded-2xl
                  border border-gray-100 dark:border-gray-800
                  bg-gray-50/50 dark:bg-gray-800/30
                  hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-600
                  transition overflow-hidden
                "
              >
                <div className="aspect-square bg-white dark:bg-gray-800 relative overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none group-hover:scale-[1.04] transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No image
                    </div>
                  )}
                  {p.has_discount && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded-md shadow-sm">
                      SALE
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] leading-snug">
                    {p.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ${Number(p.final_price ?? p.price).toLocaleString()}
                    </span>
                    {p.has_discount && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ${Number(p.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}