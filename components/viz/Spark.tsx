import React from 'react';
import Line, { LineProps } from './Line';

export interface SparkProps extends Omit<LineProps, 'width' | 'height'> {
  width?: number;
  height?: number;
}

const Spark: React.FC<SparkProps> = ({ width = 100, height = 30, ...rest }) => {
  return <Line width={width} height={height} {...rest} />;
};

export default Spark;
