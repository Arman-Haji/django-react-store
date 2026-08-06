import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useClickOutside } from '../../hooks/useClickOutside';

export const CategoriesMenu = () => {
  const { categories } = useProducts();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const closeTimer = useRef(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  const parentCategories = categories.filter((cat) => cat.parent === null);
  const getChildren = (id) => categories.filter((cat) => cat.parent === id);

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* فقط متن Categories - غیرقابل کلیک */}
      <span className="text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition font-medium cursor-pointer select-none">
        Categories
      </span>

      {/* مگا منو بزرگ (شبیه دیجی‌کالا) */}
      {isOpen && (
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2 mt-2
            w-[980px] max-w-[95vw]
            bg-white dark:bg-gray-900
            rounded-2xl shadow-2xl
            border border-gray-200 dark:border-gray-700
            z-50 overflow-hidden
          "
        >
          {/* هدر */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Browse Categories
            </span>

            <Link
              to="/category/all"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-brand-blue hover:underline"
            >
              All Products
            </Link>
          </div>

          {/* محتوای اصلی - بزرگ و چندستونه */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-h-[480px] overflow-y-auto">
            {parentCategories.map((parent) => {
              const children = getChildren(parent.id);

              return (
                <div
                  key={parent.id}
                  className="
                    p-5 
                    border-b border-r border-gray-100 dark:border-gray-800 
                    hover:bg-gray-50 dark:hover:bg-gray-800/40 
                    transition
                  "
                >
                  {/* عنوان دسته اصلی */}
                  <Link
                    to={`/category/${parent.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between mb-4 group"
                  >
                    <span className="font-bold text-[15px] text-gray-900 dark:text-white group-hover:text-brand-blue transition">
                      {parent.name}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      {parent.products_count}
                    </span>
                  </Link>

                  {/* زیردسته‌ها */}
                  {children.length > 0 ? (
                    <ul className="space-y-2">
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            to={`/category/${child.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="
                              flex items-center justify-between
                              text-sm text-gray-600 dark:text-gray-400
                              hover:text-brand-blue dark:hover:text-brand-blue
                              transition
                            "
                          >
                            <span>{child.name}</span>
                            <span className="text-xs text-gray-400">
                              {child.products_count}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400">No subcategories</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};