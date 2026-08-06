import { ProductCard } from './ProductCard';

const gridClass = `
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
`;

const Skeleton = () => (
  <div className="
    bg-white dark:bg-gray-800
    rounded-xl overflow-hidden
    shadow-md animate-pulse
  ">
    <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

export const ProductGrid = ({
  products = [],
  loading,
}) => {
  // فقط وقتی هنوز هیچ محصولی نداریم اسکلتون نشون بده
  // (یعنی بار اول صفحه)
  if (loading && products.length === 0) {
    return (
      <div className={gridClass}>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  // اگر محصولی نیست
  if (!loading && products.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No products found
        </p>
      </div>
    );
  }

  // محصولات رو نشون بده (حتی وقتی داره دوباره لود می‌شه)
  return (
    <div className={`${gridClass} ${loading ? 'opacity-60 pointer-events-none' : ''} transition-opacity duration-200`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};