import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import puppeteer from 'puppeteer';
import React from 'react';
import { renderToString } from 'react-dom/server';

import AgentStatusPanel from '../components/AgentStatusPanel';
import PredictionsPanel from '../components/PredictionsPanel';
import AgentNodeGraph from '../components/AgentNodeGraph';

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const snapshotDir = path.join(__dirname, '..', '__snapshots__');
  if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir);

  const components = [
    {
      name: 'AgentStatusPanel',
      element: <AgentStatusPanel statuses={{}} sessionId="snapshot" />,
    },
    {
      name: 'PredictionsPanel',
      element: (
        <PredictionsPanel
          agents={{ injuryScout: { score: 0.5, reason: 'stub', metadata: {} } } as any}
          pick={null}
          statuses={{ injuryScout: { status: 'completed', durationMs: 0 } } as any}
        />
      ),
    },
    {
      name: 'AgentNodeGraph',
      element: <AgentNodeGraph statuses={{ injuryScout: { status: 'started' } } as any} />,
    },
  ];

  for (const { name, element } of components) {
    const html = `<html><body>${renderToString(element)}</body></html>`;
    await page.setContent(html);
    const filePath = path.join(snapshotDir, `${name}.png`);
    const buffer = await page.screenshot();

    if (fs.existsSync(filePath)) {
      const prev = fs.readFileSync(filePath);
      const oldHash = crypto.createHash('sha256').update(prev).digest('hex');
      const newHash = crypto.createHash('sha256').update(buffer).digest('hex');
      if (oldHash !== newHash) {
        console.log(`${name} snapshot changed.`);
      }
    } else {
      console.log(`${name} snapshot saved.`);
    }

    fs.writeFileSync(filePath, buffer);
  }

  await browser.close();

  const logsPath = path.join(__dirname, '..', 'agentLogsStore.json');
  const llmsPath = path.join(__dirname, '..', 'llms.txt');
  const timestamp = new Date().toISOString();

  let logs: any[] = [];
  if (fs.existsSync(logsPath)) {
    try {
      logs = JSON.parse(fs.readFileSync(logsPath, 'utf8'));
    } catch {
      logs = [];
    }
  }

  logs.push({
    timestamp,
    command: 'npx ts-node scripts/uiSnapshot.ts',
    snapshotTaken: true,
  });
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));

  fs.appendFileSync(llmsPath, `Snapshot run: ${timestamp}\n`);
}

run();

