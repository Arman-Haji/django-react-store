// components/products/ProductAttributes.jsx
export const ProductAttributes = ({ attributes }) => {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">

      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
        Attributes
      </h3>


      <div className="grid grid-cols-2 gap-3">

        {attributes.map((attr) => (
          <div
            key={attr.attribute.id}
            className="
            flex 
            items-center 
            justify-between
            text-sm
            bg-gray-50 
            dark:bg-gray-800
            rounded-lg
            px-3
            py-2"
          >

            <span className="text-gray-500 dark:text-gray-400">
              {attr.attribute.name}
            </span>


            <span className="text-gray-900 dark:text-white font-medium">
              {attr.value}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
};