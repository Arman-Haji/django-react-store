// components/products/ProductImage.jsx
export const ProductImage = ({ product }) => {

  const getImageUrl = () => {
    if (!product.image) return null;

    if (product.image.startsWith('http')) {
      return product.image;
    }

    return `http://127.0.0.1:8000${product.image}`;
  };


  const imageUrl = getImageUrl();



  return (
    <div className="
      relative 
      aspect-square 
      rounded-xl 
      overflow-hidden 
      bg-gray-100 
      dark:bg-gray-800 
      flex 
      items-center 
      justify-center
    ">


      {
        imageUrl ? (

          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"

            onError={(e)=>{

              e.target.style.display='none';

              const parent = e.target.parentElement;

              const div = document.createElement('div');

              div.className = `
                w-full 
                h-full 
                flex 
                items-center 
                justify-center 
                text-gray-400 
                dark:text-gray-500 
                font-bold 
                text-2xl 
                p-4 
                text-center 
                break-words
              `;

              div.textContent = product.name;

              parent.appendChild(div);

            }}

          />

        )
        :
        (

          <div className="
            w-full 
            h-full 
            flex 
            items-center 
            justify-center 
            text-gray-400 
            dark:text-gray-500 
            font-bold 
            text-2xl 
            p-4 
            text-center 
            break-words
          ">

            {product.name}

          </div>

        )
      }




      {
        product.has_discount && (

          <span
            className="
              absolute 
              top-4 
              right-4 
              bg-red-500 
              text-white 
              text-sm 
              font-bold 
              px-3 
              py-1 
              rounded-full
            "
          >

            SALE

          </span>

        )
      }



      {
        product.is_featured && (

          <span
            className="
              absolute 
              top-4 
              left-4 
              bg-brand-blue 
              text-white 
              text-xs 
              font-bold 
              px-3 
              py-1 
              rounded-full
            "
          >

            Featured

          </span>

        )
      }


    </div>
  );
};