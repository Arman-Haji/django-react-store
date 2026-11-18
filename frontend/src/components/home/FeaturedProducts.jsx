import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { ProductCard } from '../products/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products/?page_size=8&ordering=-created_at')
      // اگر بک‌اند ساپورت کرد: '/products/?is_featured=true&page_size=8'
      .then((data) => setProducts(data.results || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest products</h2>
          <p className="text-sm text-gray-500 mt-1">Fresh picks from the store</p>
        </div>
        <Link
          to="/category/all"
          className="text-sm font-medium text-brand-blue hover:underline shrink-0"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}