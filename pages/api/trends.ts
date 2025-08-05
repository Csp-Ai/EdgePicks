import type { NextApiRequest, NextApiResponse } from 'next';
import { loadFlow } from '../../lib/flow/loadFlow';
import { runFlow } from '../../lib/flow/runFlow';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // @ts-ignore
  res.flushHeaders?.();

  const flowNameParam = req.query.flow;
  const flowName = typeof flowNameParam === 'string' ? flowNameParam : 'trends';
  const flow = await loadFlow(flowName);

  await runFlow(
    flow,
    { homeTeam: '', awayTeam: '' },
    ({ name, result, error }) => {
      if (!error && result) {
        res.write(`data: ${JSON.stringify({ type: 'agent', name, result })}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify({ type: 'agent', name, error: true })}\n\n`);
      }
      // @ts-ignore
      res.flush?.();
    }
  );

  res.end();
}
