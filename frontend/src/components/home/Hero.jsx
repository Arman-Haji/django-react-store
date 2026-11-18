import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    title: 'Discover deals across every category',
    subtitle: 'Shop the latest products with exclusive prices',
    cta: 'Shop now',
    to: '/category/all',
    gradient:
      'from-rose-500 via-orange-500 to-amber-400 dark:from-rose-700 dark:via-orange-700 dark:to-amber-600',
    badge: 'Special offers',
  },
  {
    title: 'New arrivals just landed',
    subtitle: 'Fresh products added to the store every week',
    cta: 'Explore new',
    to: '/category/all',
    gradient:
      'from-violet-600 via-indigo-500 to-blue-500 dark:from-violet-800 dark:via-indigo-700 dark:to-blue-800',
    badge: 'New season',
  },
  {
    title: 'On sale — limited time',
    subtitle: 'Save more on top-rated items',
    cta: 'View discounts',
    to: '/category/all',
    gradient:
      'from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-800 dark:via-teal-700 dark:to-cyan-800',
    badge: 'Hot deals',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const go = (dir) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  };

  const slide = SLIDES[index];

  return (
    <section className="relative overflow-hidden rounded-2xl min-h-[220px] sm:min-h-[280px]">
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          className={`
            absolute inset-0 bg-gradient-to-br ${s.gradient}
            transition-opacity duration-700 ease-out
            ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_55%)]" />
        </div>
      ))}

      <div className="relative z-20 h-full min-h-[220px] sm:min-h-[280px] p-6 sm:p-10 flex flex-col justify-end">
        <span className="inline-flex w-fit text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-lg mb-3">
          {slide.badge}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-lg">
          {slide.title}
        </h1>
        <p className="mt-2 text-sm text-white/85 max-w-md">{slide.subtitle}</p>
        <Link
          to={slide.to}
          className="inline-flex w-fit mt-5 px-5 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition"
        >
          {slide.cta} →
        </Link>

        {/* Dots */}
        <div className="flex items-center gap-2 mt-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition"
        aria-label="Next"
      >
        ›
      </button>
    </section>
  );
}