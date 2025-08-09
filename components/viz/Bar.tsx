import React, { useRef, useState } from 'react';

export interface BarProps {
  data: number[];
  width?: number;
  height?: number;
  ariaLabel: string;
  color?: string;
  highlightColor?: string;
}

const Bar: React.FC<BarProps> = ({
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
  const barWidth = width / data.length;

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const idx = Math.floor(x / barWidth);
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
      {data.map((d, i) => {
        const h = (d / max) * height;
        return (
          <rect
            key={i}
            x={i * barWidth}
            y={height - h}
            width={barWidth - 1}
            height={h}
            fill={i === hover ? highlightColor : color}
          />
        );
      })}
    </svg>
  );
};

export default Bar;
