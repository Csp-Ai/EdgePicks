import React, { useState } from 'react';
import TrustSummary from '../../components/trust/TrustSummary';
import AuditActivity from '../../components/trust/AuditActivity';
import AgentExplainers from '../../components/trust/AgentExplainers';
import AgreementMeter from '../../components/trust/AgreementMeter';

type Tab = 'overview' | 'audit' | 'agents';

const TrustPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'audit', label: 'Audit' },
    { id: 'agents', label: 'Agents' },
  ];

  const handleKey = (id: Tab, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') setTab(id);
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Trust &amp; Transparency</h1>
      <div role="tablist" aria-label="Trust sections" className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`${t.id}-tab`}
            aria-controls={`${t.id}-panel`}
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => handleKey(t.id, e)}
            className={`px-3 py-1 border rounded ${
              tab === t.id ? 'bg-gray-200' : ''
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section
        id="overview-panel"
        role="tabpanel"
        aria-labelledby="overview-tab"
        hidden={tab !== 'overview'}
      >
        <TrustSummary />
        <div className="mt-6">
          <AgreementMeter />
        </div>
      </section>
      <section
        id="audit-panel"
        role="tabpanel"
        aria-labelledby="audit-tab"
        hidden={tab !== 'audit'}
      >
        <AuditActivity />
      </section>
      <section
        id="agents-panel"
        role="tabpanel"
        aria-labelledby="agents-tab"
        hidden={tab !== 'agents'}
      >
        <AgentExplainers />
      </section>
    </main>
  );
};

export default TrustPage;
