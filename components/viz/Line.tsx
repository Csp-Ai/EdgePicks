import React, { useRef, useState } from 'react';

export interface LineProps {
  data: number[];
  width?: number;
  height?: number;
  ariaLabel: string;
  color?: string;
  highlightColor?: string;
}

const Line: React.FC<LineProps> = ({
  data,
  width = 200,
  height = 100,
  ariaLabel,
  color = '#8884d8',
  highlightColor = '#ff7300',
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const frame = useRef<number>();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const max = Math.max(...data);
  const step = width / (data.length - 1);
  const points = data
    .map((d, i) => `${i * step},${height - (d / max) * height}`)
    .join(' ');

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const idx = Math.round(x / step);
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setHover(idx));
  };

  const handleLeave = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setHover(null));
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        points={points}
      />
      {hover != null && data[hover] != null && (
        <circle
          cx={hover * step}
          cy={height - (data[hover] / max) * height}
          r={4}
          fill={highlightColor}
        />
      )}
    </svg>
  );
};

export default Line;
