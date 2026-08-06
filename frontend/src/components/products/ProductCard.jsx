// components/products/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const price = parseFloat(product.price) || 0;
  const finalPrice = parseFloat(product.final_price) || price;
  const discountPrice = parseFloat(product.discount_price) || 0;
  const hasDiscount = product.has_discount || (discountPrice > 0 && discountPrice < price);
  
  const discountPercent = hasDiscount && price > 0 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  const getImageUrl = () => {
    if (!product.image) return null;
    if (product.image.startsWith('http')) return product.image;
    return `http://127.0.0.1:8000${product.image}`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const imageUrl = getImageUrl();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-xl p-4 text-center break-words">
                    ${product.name}
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold text-xl p-4 text-center break-words">
              {product.name}
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="absolute top-2 left-2 bg-brand-blue text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2 hover:text-brand-blue dark:hover:text-brand-blue transition min-h-[56px]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-brand-blue dark:text-brand-blue">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-2 bg-brand-blue hover:bg-brand-dark disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition duration-200"
            aria-label="Add to cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>

        {product.stock <= 0 && (
          <span className="text-red-500 text-sm font-medium mt-2 block">
            Out of Stock
          </span>
        )}
      </div>
    </div>
  );
};