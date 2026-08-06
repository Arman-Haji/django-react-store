// pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';

import { ProductImage } from '../components/products/ProductImage';
import { ProductInfo } from '../components/products/ProductInfo';


function ProductDetail() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const { getProductById } = useProducts();
  const { addToCart } = useCart();


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {

    const fetchProduct = async () => {

      if (!slug) {
        setError('Product ID is missing');
        setLoading(false);
        return;
      }


      try {

        const data = await getProductById(slug);
        setProduct(data);

      } catch (err) {

        setError('Product not found');

        setTimeout(() => {
          navigate('/categories');
        }, 2000);

      } finally {

        setLoading(false);

      }

    };


    fetchProduct();

  }, [slug, getProductById, navigate]);



  if (loading) {

    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

        <Navbar />

        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Loading...
          </p>
        </div>

        <Footer />

      </div>
    );

  }



  if (!product) {

    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

        <Navbar />

        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {error || 'Product not found'}
          </p>
        </div>

        <Footer />

      </div>
    );

  }



  return (

    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

      <Navbar />


      <main className="
        flex-grow 
        max-w-7xl 
        mx-auto 
        px-4 
        sm:px-6 
        lg:px-8 
        py-8 
        w-full
      ">


        <div className="
          bg-white 
          dark:bg-gray-900 
          rounded-2xl 
          shadow-xl 
          overflow-hidden
        ">


          <div className="
            grid 
            grid-cols-1 
            md:grid-cols-2 
            gap-8 
            p-6 
            md:p-8
          ">


            {/* Left Side */}

            <ProductImage
              product={product}
            />



            {/* Right Side */}

            <ProductInfo
              product={product}
              addToCart={addToCart}
            />


          </div>


        </div>


      </main>


      <Footer />

    </div>

  );

}


export default ProductDetail;