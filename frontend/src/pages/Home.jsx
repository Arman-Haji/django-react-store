import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BannerSlider from '../components/home/BannerSlider';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductRow from '../components/home/ProductRow';
import Benefits from '../components/home/Benefits';

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
          {/* اسلایدر اصلی — تعداد اسلاید = تعداد بنرهای group */}
          <BannerSlider
            group="home_main"
            autoplayMs={5000}
            aspect="aspect-[21/9] sm:aspect-[3/1]"
            maxHeight="max-h-[240px] sm:max-h-[320px]"
          />

          <Benefits />

          <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              Shop by category
            </h2>
            <CategoryShowcase />
          </section>

          <ProductRow
            title="Amazing offers"
            subtitle="Best discounts right now"
            query="page_size=12&has_discount=true&ordering=-created_at"
            accent="bg-rose-500"
          />

          {/* اسلایدر دوم اختیاری */}
          <BannerSlider
            group="home_secondary"
            autoplayMs={6000}
            aspect="aspect-[4/1]"
            maxHeight="max-h-[160px]"
          />
          <ProductRow
            title="Newest products"
            query="page_size=12&ordering=-created_at"
            accent="bg-brand-blue"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;