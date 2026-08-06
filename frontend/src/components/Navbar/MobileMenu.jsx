import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';

export const MobileMenu = ({ user, navLinks, location, onClose, onLogout }) => {
  const { categories } = useProducts();
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState(false);

  const parents = categories.filter((c) => !c.parent);
  const children = (id) => categories.filter((c) => c.parent === id);

  const selectCategory = (slug) => {
    onClose();
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      navigate('/categories');
    }
  };

  return (
    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col space-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={`px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
              location.pathname === link.path
                ? 'text-brand-blue bg-gray-50 dark:bg-gray-800 font-medium'
                : ''
            }`}
          >
            {link.label}
          </Link>
        ))}

        <button
          onClick={() => setOpenCategories(!openCategories)}
          className="px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between"
        >
          Categories
          <svg
            className={`w-4 h-4 transition ${openCategories ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openCategories && (
          <div className="pl-4 space-y-1">
            <button
              onClick={() => selectCategory('')}
              className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              همه دسته‌بندی‌ها
            </button>

            {parents.map((cat) => (
              <div key={cat.id}>
                <button
                  onClick={() => selectCategory(cat.slug)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {cat.name}
                </button>

                {children(cat.id).map((child) => (
                  <button
                    key={child.id}
                    onClick={() => selectCategory(child.slug)}
                    className="block w-full text-left px-6 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    └ {child.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
          {/* User menu اینجا اضافه میشه */}
        </div>
      </div>
    </div>
  );
};