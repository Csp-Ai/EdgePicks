'use client';

import React from 'react';
import Tooltip from '../Tooltip';

const ConfidenceExplainer: React.FC = () => {
  return (
    <div className="text-sm space-y-3">
      <p>
        <Tooltip
          content={
            <div>
              <strong>Confidence Interval:</strong>
              <div>95% CI [45%, 55%] means the true value likely falls in that range.</div>
            </div>
          }
        >
          <span className="underline cursor-help">CI</span>
        </Tooltip>{' '}provides the likely range for an estimate.
      </p>
      <p>
        <Tooltip
          content={
            <div>
              <strong>Number Needed to Treat:</strong>
              <div>NNT 20 means treating 20 people helps one extra person.</div>
            </div>
          }
        >
          <span className="underline cursor-help">NNT</span>
        </Tooltip>{' '}shows the impact of an intervention.
      </p>
      <p>
        <Tooltip
          content={
            <div>
              <strong>Calibration:</strong>
              <div>If 60% predictions occur 6 out of 10 times, they are well calibrated.</div>
            </div>
          }
        >
          <span className="underline cursor-help">Calibration</span>
        </Tooltip>{' '}checks how probabilities match outcomes.
      </p>
    </div>
  );
};

export default ConfidenceExplainer;
