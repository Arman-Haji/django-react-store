// pages/Products.jsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { useProducts } from '../contexts/ProductContext';


function Products(){

  const {
    products,
    loading,
    filters,
    updateFilters,
    pagination
  } = useProducts();


  return(
    <div className="
      min-h-screen flex flex-col
      bg-gray-50 dark:bg-gray-950
    ">

      <Navbar/>


      <main className="
        flex-grow max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        py-8 w-full
      ">


        <div className="
          flex flex-col sm:flex-row
          justify-between items-start
          sm:items-center gap-4 mb-8
        ">


          <h1 className="
            text-3xl font-bold
            text-gray-900 dark:text-white
          ">
            Products
          </h1>



          <div className="
            flex items-center gap-4
          ">

          </div>


        </div>



        <div className="
          flex flex-col md:flex-row gap-6
        ">


          <aside className="md:w-64">
            <ProductFilters/>
          </aside>



          <section className="flex-1">

            <ProductGrid
              products={products}
              loading={loading}
            />

          </section>


        </div>


      </main>


      <Footer/>

    </div>
  );
}


export default Products;