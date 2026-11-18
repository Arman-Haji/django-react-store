import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const COLORS = [
  'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300',
  'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300',
  'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300',
  'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
  'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300',
  'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300',
  'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-300',
];

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/categories/')
      .then((data) => {
        const list = (data.results || data).filter((c) => !c.parent);
        setCategories(list.slice(0, 12));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-24 h-24 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map((cat, i) => (
        <Link
          key={cat.id}
          to={`/category/${cat.slug}`}
          className="flex flex-col items-center gap-2 min-w-[88px] shrink-0 group"
        >
          <div
            className={`
              w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center
              text-lg font-bold transition group-hover:scale-105 group-hover:shadow-md
              ${COLORS[i % COLORS.length]}
            `}
          >
            {cat.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium line-clamp-2 max-w-[88px]">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}