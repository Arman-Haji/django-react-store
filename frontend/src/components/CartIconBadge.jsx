// components/CartIconBadge.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';

function CartIconBadge() {
  const { getItemCount } = useCart();
  const totalItems = getItemCount();

  return (
    <Link 
      to="/cart" 
      className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <FaShoppingCart size={20} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 animate-pulse">
          {totalItems}
        </span>
      )}
    </Link>
  );
}

export default CartIconBadge;