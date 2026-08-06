import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export const ProductFilters = () => {
  const navigate = useNavigate();

  const {
    categories,
    attributes,
    filters,
    updateFilters,
  } = useProducts();

  const [price, setPrice] = useState([
    filters.min_price ?? 0,
    filters.max_price ?? 10000,
  ]);

  // برای باز/بسته بودن هر بخش Attribute
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    setPrice([
      filters.min_price ?? 0,
      filters.max_price ?? 10000,
    ]);
  }, [filters.min_price, filters.max_price]);

  // وقتی attributes اومد، همه‌شون رو باز کن
  useEffect(() => {
    if (attributes.length > 0) {
      const initial = {};
      attributes.forEach((attr) => {
        initial[attr.slug] = true;
      });
      setOpenSections(initial);
    }
  }, [attributes]);

  const parents = categories.filter((c) => c.parent === null);
  const children = (id) => categories.filter((c) => c.parent === id);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (!value) {
      navigate('/category/all');
    } else {
      navigate(`/category/${value}`);
    }
  };

  const toggleSection = (slug) => {
    setOpenSections((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  // انتخاب / حذف یک value از Attribute
  const handleAttrChange = (slug, value) => {
    const current = filters.attrs?.[slug] || [];
    let next;

    if (current.includes(value)) {
      next = current.filter((v) => v !== value);
    } else {
      next = [...current, value];
    }

    const newAttrs = { ...filters.attrs };

    if (next.length === 0) {
      delete newAttrs[slug];
    } else {
      newAttrs[slug] = next;
    }

    updateFilters({ attrs: newAttrs });
  };

  const clearAllFilters = () => {
    updateFilters({
      search: '',
      sort: '-created_at',
      min_price: 0,
      max_price: 10000,
      in_stock: false,
      has_discount: false,
      attrs: {},
    });
    setPrice([0, 10000]);
  };

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Filters
        </h2>
        <button
          onClick={clearAllFilters}
          className="text-xs text-brand-blue hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={handleCategoryChange}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="">All Categories</option>
          {parents.map((parent) => (
            <optgroup key={parent.id} label={parent.name}>
              <option value={parent.slug}>{parent.name}</option>
              {children(parent.id).map((child) => (
                <option key={child.id} value={child.slug}>
                  └ {child.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="-created_at">Newest</option>
          <option value="created_at">Oldest</option>
          <option value="-price">Price: High to Low</option>
          <option value="price">Price: Low to High</option>
          <option value="name">Name (A-Z)</option>
          <option value="-name">Name (Z-A)</option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block mb-3 text-sm font-medium text-gray-600 dark:text-gray-300">
          Price Range
        </label>
        <Slider
          range
          min={0}
          max={10000}
          step={10}
          value={price}
          onChange={(value) => setPrice(value)}
          onChangeComplete={(value) =>
            updateFilters({
              min_price: value[0],
              max_price: value[1],
            })
          }
        />
        <div className="flex justify-between mt-3 text-sm text-gray-700 dark:text-gray-300">
          <span>${price[0].toLocaleString()}</span>
          <span>${price[1].toLocaleString()}</span>
        </div>
      </div>
{/* fixe */}
      {/* In Stock / On Sale */}
      <div className="mb-6 space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.in_stock || false}
            onChange={(e) => updateFilters({ in_stock: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            In Stock Only
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.has_discount || false}
            onChange={(e) => updateFilters({ has_discount: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            On Sale Only
          </span>
        </label>
      </div>

      {/* Attributes - شبیه دیجی‌کالا */}
      {attributes.map((attr) => (
        <div key={attr.slug} className="mb-5 border-t border-gray-100 dark:border-gray-800 pt-4">
          <button
            type="button"
            onClick={() => toggleSection(attr.slug)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {attr.name}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition ${
                openSections[attr.slug] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSections[attr.slug] && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {(attr.values || []).map((value) => {
                const isChecked = (filters.attrs?.[attr.slug] || []).includes(value);

                return (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAttrChange(attr.slug, value)}
                      className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-brand-blue transition">
                      {value}
                    </span>
                  </label>
                );
              })}

              {(!attr.values || attr.values.length === 0) && (
                <p className="text-xs text-gray-400">No values</p>
              )}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};