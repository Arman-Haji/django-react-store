import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useClickOutside } from '../../hooks/useClickOutside';
import { api } from '../../utils/api';

export function SearchBar() {
  const navigate = useNavigate();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useClickOutside(ref, () => setOpen(false));

  // سرچ زنده با debounce کوتاه
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.get(
          `/products/?search=${encodeURIComponent(query.trim())}&page_size=6`
        );
        setResults(data.results || data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const goToAll = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/category/all?search=${encodeURIComponent(query.trim())}`);
  };

  const selectProduct = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue"
        aria-label="Search"
      >
        <FaSearch size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <form onSubmit={goToAll} className="flex border-b border-gray-100 dark:border-gray-800">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-3 bg-transparent text-sm text-gray-900 dark:text-white outline-none"
            />
            <button type="submit" className="px-4 text-brand-blue">
              <FaSearch size={14} />
            </button>
          </form>

          <div className="max-h-80 overflow-y-auto">
            {!query.trim() && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                Type to search...
              </p>
            )}

            {query.trim() && loading && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">Searching...</p>
            )}

            {query.trim() && !loading && results.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-gray-400">
                No products found
              </p>
            )}

            {results.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                onClick={selectProduct}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${Number(p.final_price ?? p.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}

            {query.trim() && !loading && results.length > 0 && (
              <button
                type="button"
                onClick={goToAll}
                className="w-full px-4 py-3 text-sm text-brand-blue font-medium border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                View all results for “{query.trim()}”
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}