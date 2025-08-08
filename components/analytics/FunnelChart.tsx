import React from 'react';
import { FunnelChart as ReFunnelChart, Funnel, Tooltip, LabelList } from 'recharts';

export interface FunnelDatum {
  name: string;
  value: number;
}

interface Props {
  data: FunnelDatum[];
}

const FunnelChart: React.FC<Props> = ({ data }) => {
  return (
    <ReFunnelChart width={600} height={400}>
      <Tooltip />
      <Funnel dataKey="value" data={data} isAnimationActive={false}>
        <LabelList position="right" dataKey="name" />
      </Funnel>
    </ReFunnelChart>
  );
};

export default FunnelChart;
