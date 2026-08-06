// components/common/Input.jsx
export const Input = ({ 
  label, 
  type = 'text', 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  helper, 
  disabled 
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
        placeholder-gray-500 dark:placeholder-gray-400
        focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none transition 
        disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
    />
    {helper && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{helper}</p>}
  </div>
);