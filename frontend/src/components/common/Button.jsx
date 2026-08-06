// components/common/Button.jsx
export const Button = ({ 
  type = 'button', 
  onClick, 
  children, 
  loading, 
  disabled, 
  variant = 'primary', 
  className = '' 
}) => {
  const variants = {
    primary: 'bg-brand-blue hover:bg-brand-dark text-white dark:bg-brand-blue dark:hover:bg-brand-dark',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700',
    success: 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3.5 font-medium rounded-xl transition duration-200 
        disabled:opacity-60 disabled:cursor-not-allowed 
        ${variants[variant]} ${className}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};