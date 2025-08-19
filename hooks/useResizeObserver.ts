import { useEffect, useState } from "react";

interface Options {
  minW?: number;
  minH?: number;
}

export default function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  { minW = 0, minH = 0 }: Options = {},
) {
  const [size, setSize] = useState({ width: minW, height: minH });

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      setSize({ width: Math.max(minW, width), height: Math.max(minH, height) });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref, minW, minH]);

  return size;
}
