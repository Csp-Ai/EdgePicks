'use client';

import React from 'react';
import { AccessibleTooltip } from '@/components/ui/accessible-tooltip';

const ConfidenceExplainer: React.FC = () => {
  return (
    <div className="text-sm space-y-3">
      <p>
        <AccessibleTooltip
          content="95% CI [45%, 55%] means the true value likely falls in that range."
        >
          <span className="underline cursor-help">CI</span>
        </AccessibleTooltip>{' '}provides the likely range for an estimate.
      </p>
      <p>
        <AccessibleTooltip
          content="NNT 20 means treating 20 people helps one extra person."
        >
          <span className="underline cursor-help">NNT</span>
        </AccessibleTooltip>{' '}shows the impact of an intervention.
      </p>
      <p>
        <AccessibleTooltip
          content="If 60% predictions occur 6 out of 10 times, they are well calibrated."
        >
          <span className="underline cursor-help">Calibration</span>
        </AccessibleTooltip>{' '}checks how probabilities match outcomes.
      </p>
    </div>
  );
};

export default ConfidenceExplainer;
