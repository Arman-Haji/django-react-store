import { useRef, useCallback, useEffect } from 'react';

/**
 * اسکرول افقی با درگ — حرکت هم‌زمان با موس (بدون نیاز به رها کردن)
 */
export function useDragScroll({ speed = 1.6 } = {}) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const moved = useRef(false);

  const onMouseDown = useCallback((e) => {
    const el = ref.current;
    if (!el || e.button !== 0) return;

    dragging.current = true;
    moved.current = false;
    startX.current = e.pageX;
    startScroll.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
    // جلوگیری از drag پیش‌فرض تصویر
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || !dragging.current) return;

      const dx = e.pageX - startX.current;
      if (Math.abs(dx) > 3) moved.current = true;

      // حرکت زنده — هر فریم موقع حرکت موس
      el.scrollLeft = startScroll.current - dx * speed;
    },
    [speed]
  );

  const onMouseUp = useCallback(() => {
    const el = ref.current;
    dragging.current = false;
    if (el) {
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    }
  }, []);

  // listener روی document تا بیرون از باکس هم درگ ادامه پیدا کند
  useEffect(() => {
    const move = (e) => onMouseMove(e);
    const up = () => onMouseUp();

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
  }, [onMouseMove, onMouseUp]);

  // لمس موبایل — native overflow کافی است؛ اختیاری:
  const onTouchStart = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    dragging.current = true;
    moved.current = false;
    startX.current = e.touches[0].pageX;
    startScroll.current = el.scrollLeft;
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el || !dragging.current) return;
      const dx = e.touches[0].pageX - startX.current;
      if (Math.abs(dx) > 3) moved.current = true;
      el.scrollLeft = startScroll.current - dx * speed;
    },
    [speed]
  );

  const onTouchEnd = useCallback(() => {
    dragging.current = false;
  }, []);

  const onClickCapture = useCallback((e) => {
    if (moved.current) {
      e.preventDefault();
      e.stopPropagation();
      moved.current = false;
    }
  }, []);

  return {
    ref,
    handlers: {
      onMouseDown,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClickCapture,
    },
  };
}