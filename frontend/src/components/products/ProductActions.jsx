// components/products/ProductActions.jsx
import { useState } from 'react';

export const ProductActions = ({ product, addToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      setError('Product is out of stock');
      return;
    }

    addToCart(product, quantity);

    setSuccess('Added to cart successfully!');
    setError('');

    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };


  return (
    <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">

      <div className="flex items-center gap-4">

        {/* Quantity */}
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">

          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            -
          </button>


          <span className="px-4 py-2 text-gray-900 dark:text-white min-w-[40px] text-center">
            {quantity}
          </span>


          <button
            onClick={() =>
              setQuantity(
                Math.min(product.stock, quantity + 1)
              )
            }
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            +
          </button>

        </div>


        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="
          flex-1 py-3 
          bg-brand-blue 
          hover:bg-brand-dark 
          disabled:bg-gray-400 
          disabled:cursor-not-allowed
          text-white 
          font-medium 
          rounded-lg 
          transition"
        >
          Add to Cart
        </button>

      </div>


      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}


      {success && (
        <p className="text-green-500 text-sm">
          {success}
        </p>
      )}

    </div>
  );
};