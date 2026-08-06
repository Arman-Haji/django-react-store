// components/common/AvatarUpload.jsx
export const AvatarUpload = ({ imagePreview, username, onFileChange }) => {
  const getInitial = () => username?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-blue/20 dark:border-brand-blue/40 bg-gray-100 dark:bg-gray-800">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-4xl">
              {getInitial()}
            </div>
          )}
        </div>
        <label className="absolute bottom-0 right-0 bg-brand-blue hover:bg-brand-dark dark:bg-brand-blue dark:hover:bg-brand-dark text-white rounded-full p-2 cursor-pointer transition shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </label>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Click on camera icon to change photo</p>
    </div>
  );
};