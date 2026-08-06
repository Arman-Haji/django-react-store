// components/products/ProductInfo.jsx
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

const toNumber = (value) => {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }

  return 0;
};


export const ProductInfo = ({ product }) => {

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const price = toNumber(product.price);
  const finalPrice = toNumber(product.final_price) || price;
  const discountPrice = toNumber(product.discount_price);


  const hasDiscount =
    product.has_discount ||
    (discountPrice > 0 && discountPrice < price);


  const discountPercent =
    hasDiscount && price > 0
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;



  const handleAddToCart = () => {

    if(product.stock <= 0){
      setError('Product is out of stock');
      return;
    }


    addToCart(product, quantity);

    setSuccess('Added to cart successfully!');

    setTimeout(()=>{
      setSuccess('');
    },3000);
  };



  return (
    <div className="flex flex-col">


      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h1>


      {product.category && (
        <span className="text-sm text-brand-blue mb-4">
          {product.category.name}
        </span>
      )}



      <div className="flex items-center gap-3 mb-4">

        {hasDiscount ? (
          <>
            <span className="text-2xl font-bold text-brand-blue">
              ${finalPrice.toFixed(2)}
            </span>

            <span className="text-lg text-gray-400 line-through">
              ${price.toFixed(2)}
            </span>

            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          </>
        )
        :
        (
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </span>
        )}

      </div>




      <div className="mb-4">

        <span
          className={`text-sm font-medium ${
            product.stock > 0 
            ? 'text-green-500'
            : 'text-red-500'
          }`}
        >

          {
            product.stock > 0
            ? `In Stock: ${product.stock}`
            : 'Out of Stock'
          }

        </span>

      </div>




      <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">
        {
          product.description ||
          'No description available.'
        }
      </p>





      {
        product.attributes?.length > 0 && (

          <div className="mb-6">

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Attributes
            </h3>


            <div className="grid grid-cols-2 gap-2">

              {
                product.attributes.map(attr=>(

                  <div
                    key={attr.attribute.id}
                    className="text-sm"
                  >

                    <span className="text-gray-500">
                      {attr.attribute.name}:
                    </span>


                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {attr.value}
                    </span>


                  </div>

                ))
              }

            </div>

          </div>

        )
      }






      <div className="flex flex-col gap-4 mt-auto pt-4 border-t dark:text-white">


        <div className="flex items-center gap-4">


          <div className="flex items-center border rounded-lg">

            <button
              onClick={()=>setQuantity(Math.max(1,quantity-1))}
              className="px-3 py-2"
            >
              -
            </button>


            <span className="px-4" >
              {quantity}
            </span>


            <button
              onClick={()=>setQuantity(Math.min(product.stock,quantity+1))}
              className="px-3 py-2"
            >
              +
            </button>

          </div>



          <button

            onClick={handleAddToCart}

            disabled={product.stock<=0}

            className="
            flex-1 py-3 
            bg-brand-blue 
            hover:bg-brand-dark
            disabled:bg-gray-400
            text-white
            rounded-lg
            font-medium
            "

          >

            Add to Cart

          </button>


        </div>



        {
          error &&
          <p className="text-red-500 text-sm">
            {error}
          </p>
        }


        {
          success &&
          <p className="text-green-500 text-sm">
            {success}
          </p>
        }


      </div>


    </div>
  );
};