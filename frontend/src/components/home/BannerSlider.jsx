import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

/**
 * group      → فیلتر بک‌اند (?group=)
 * autoplayMs → 0 = خاموش
 * aspect     → نسبت ابعاد Tailwind
 * maxHeight  → سقف ارتفاع
 */
export default function BannerSlider({
  group = 'home_main',
  autoplayMs = 5000,
  className = '',
  aspect = 'aspect-[21/9] sm:aspect-[3/1]',
  maxHeight = 'max-h-[240px] sm:max-h-[320px]',
}) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const drag = useRef({
    active: false,
    startX: 0,
    delta: 0,
    moved: false,
  });

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/banners/?group=${encodeURIComponent(group)}`)
      .then((data) => {
        const list = data.results || data;
        setBanners(Array.isArray(list) ? list : []);
        setIndex(0);
      })
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, [group]);

  const count = banners.length;

  const goTo = useCallback(
    (i) => {
      if (count === 0) return;
      const next = ((i % count) + count) % count;
      setIndex(next);
    },
    [count]
  );

  // autoplay
  useEffect(() => {
    if (count < 2 || !autoplayMs) return undefined;
    const id = setInterval(() => goTo(indexRef.current + 1), autoplayMs);
    return () => clearInterval(id);
  }, [count, autoplayMs, goTo]);

  // sync transform when index changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
    track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }, [index]);

  const onPointerDown = (e) => {
    if (count < 2) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    drag.current = {
      active: true,
      startX: e.clientX,
      delta: 0,
      moved: false,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!drag.current.active || !trackRef.current || !viewportRef.current) return;

    const delta = e.clientX - drag.current.startX;
    drag.current.delta = delta;
    if (Math.abs(delta) > 5) drag.current.moved = true;

    const width = viewportRef.current.offsetWidth;
    const offset = -indexRef.current * width + delta;

    trackRef.current.style.transition = 'none';
    trackRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const onPointerUp = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;

    const width = viewportRef.current?.offsetWidth || 1;
    const threshold = width * 0.18;
    let next = indexRef.current;

    if (drag.current.delta < -threshold) next += 1;
    else if (drag.current.delta > threshold) next -= 1;

    if (trackRef.current) {
      trackRef.current.style.transition =
        'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
    }
    goTo(next);

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const frameClass = `relative w-full overflow-hidden rounded-2xl ${aspect} ${maxHeight} ${className}`;

  if (loading) {
    return (
      <div
        className={`${frameClass} bg-gray-100 dark:bg-gray-800 animate-pulse`}
      />
    );
  }

  if (count === 0) {
    return (
      <div
        className={`
          ${frameClass}
          border border-dashed border-gray-300 dark:border-gray-700
          bg-gray-50 dark:bg-gray-900/50
          flex items-center justify-center
        `}
      >
        <p className="text-sm text-gray-400 dark:text-gray-500">No banners</p>
      </div>
    );
  }

  const renderBanner = (banner) => {
    const src = banner.image_url || banner.image;
    const img = (
      <img
        src={src}
        alt={banner.title || 'Banner'}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
    );

    if (!banner.link) {
      return <div className="absolute inset-0">{img}</div>;
    }

    const isExternal = /^https?:\/\//i.test(banner.link);

    if (isExternal) {
      return (
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 block"
        >
          {img}
        </a>
      );
    }

    return (
      <Link to={banner.link} className="absolute inset-0 block">
        {img}
      </Link>
    );
  };

  return (
    <div
      ref={viewportRef}
      className={`${frameClass} bg-gray-100 dark:bg-gray-800 touch-pan-y`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <div
        ref={trackRef}
        className="absolute inset-0 flex will-change-transform"
        style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
      >
        {banners.map((b) => (
          <div key={b.id} className="relative w-full h-full shrink-0">
            {renderBanner(b)}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/45 text-white flex items-center justify-center backdrop-blur-sm transition"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/45 text-white flex items-center justify-center backdrop-blur-sm transition"
            aria-label="Next"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}