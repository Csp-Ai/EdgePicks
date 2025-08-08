import { useEffect, useRef, useState } from 'react';

export default function useLowImpact() {
  const [lowImpact, setLowImpact] = useState(false);
  const rafRef = useRef<typeof window.requestAnimationFrame>();
  const cancelRef = useRef<typeof window.cancelAnimationFrame>();

  useEffect(() => {
    const html = document.documentElement;

    if (!rafRef.current) {
      rafRef.current = window.requestAnimationFrame;
      cancelRef.current = window.cancelAnimationFrame;
    }

    if (lowImpact) {
      html.classList.add('low-impact');
      window.requestAnimationFrame = (cb: FrameRequestCallback): number =>
        window.setTimeout(() => cb(Date.now()), 200);
      window.cancelAnimationFrame = (id: number) => clearTimeout(id);
    } else {
      html.classList.remove('low-impact');
      if (rafRef.current) window.requestAnimationFrame = rafRef.current;
      if (cancelRef.current) window.cancelAnimationFrame = cancelRef.current;
    }

    return () => {
      html.classList.remove('low-impact');
      if (rafRef.current) window.requestAnimationFrame = rafRef.current;
      if (cancelRef.current) window.cancelAnimationFrame = cancelRef.current;
    };
  }, [lowImpact]);

  return [lowImpact, setLowImpact] as const;
}
