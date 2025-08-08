import React, { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../components/HeroSection';
import PredictionTracker from '../components/PredictionTracker';
import PredictionsPanel from '../components/PredictionsPanel';
import { DemoModeProvider, useDemoMode } from '../lib/demoMode';
jest.mock('../lib/logUiEvent', () => ({ logUiEvent: jest.fn() }));

const DemoFlow: React.FC = () => {
  const [prediction, setPrediction] = useState<any | null>(null);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/run-predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setPrediction(data.predictions[0]);
    })();
  }, []);

  return (
    <div>
      {!reveal && (
        <PredictionTracker onReveal={() => setReveal(true)} stepDuration={1} />
      )}
      {prediction && reveal && (
        <PredictionsPanel
          agents={prediction.agents}
          pick={{
            winner: prediction.winner,
            confidence: prediction.confidence / 100,
            topReasons: [],
          }}
          statuses={Object.fromEntries(
            Object.keys(prediction.agents).map((n) => [n, { status: 'completed' }])
          )}
          nodes={[]}
          edges={[]}
        />
      )}
    </div>
  );
};

const DemoRoot: React.FC = () => {
  const { setEnabled } = useDemoMode();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setEnabled(true);
    setReady(true);
  }, [setEnabled]);
  if (!ready) return null;
  return (
    <>
      <HeroSection />
      <DemoFlow />
    </>
  );
};

test('demo mode intercepts fetch and renders fixtures end-to-end', async () => {
  const realFetch = global.fetch;
  const fetchSpy = jest.fn(() => Promise.reject(new Error('network')));
  global.fetch = fetchSpy as any;

  render(
    <DemoModeProvider>
      <DemoRoot />
    </DemoModeProvider>
  );

  await screen.findByText('Alpha FC');

  expect(fetchSpy).not.toHaveBeenCalled();

  const finalStep = await screen.findByText('Pick Ready – Click to Reveal');
  finalStep.click();

  await screen.findByText('Prediction: Alpha FC');

  global.fetch = realFetch;
});
