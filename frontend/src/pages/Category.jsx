import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { useProducts } from '../contexts/ProductContext';

function Category() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products,
    loading,
    pagination,
    filters,
    updateFilters,
  } = useProducts();

  useEffect(() => {
    updateFilters({
      category: slug === 'all' ? '' : slug,
      attrs: {}, 
    });
  }, [slug]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.sort && filters.sort !== '-created_at') {
      params.set('sort', filters.sort);
    }
    if (filters.min_price > 0) params.set('min_price', filters.min_price);
    if (filters.max_price < 10000) params.set('max_price', filters.max_price);
    if (filters.in_stock) params.set('in_stock', '1');
    if (filters.has_discount) params.set('has_discount', '1');
    if (filters.search) params.set('search', filters.search);

    Object.entries(filters.attrs || {}).forEach(([key, values]) => {
      if (values?.length) {
        params.set(`attr_${key}`, values.join(','));
      }
    });

    setSearchParams(params, { replace: true });
  }, [
    filters.sort,
    filters.min_price,
    filters.max_price,
    filters.in_stock,
    filters.has_discount,
    filters.search,
    filters.attrs,
  ]);

  useEffect(() => {
    const attrs = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('attr_')) {
        attrs[key.replace('attr_', '')] = value.split(',');
      }
    });

    updateFilters({
      sort: searchParams.get('sort') || '-created_at',
      min_price: Number(searchParams.get('min_price')) || 0,
      max_price: Number(searchParams.get('max_price')) || 10000,
      in_stock: searchParams.get('in_stock') === '1',
      has_discount: searchParams.get('has_discount') === '1',
      search: searchParams.get('search') || '',
      attrs,
    });

  }, []);

  const title = slug === 'all' ? 'All Products' : slug.replace(/-/g, ' ');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {title}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.count} products
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64">
            <ProductFilters />
          </aside>
          <section className="flex-1">
            <ProductGrid products={products} loading={loading} />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Category;