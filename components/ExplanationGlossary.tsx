import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AgentTooltip from './AgentTooltip';
import { registry as agentRegistry } from '@/lib/agents/registry';
import { formatAgentName } from '@/lib/utils';

type Props = {
  onClose: () => void;
  highlightAgent?: string | null;
};

const ExplanationGlossary: React.FC<Props> = ({ onClose, highlightAgent }) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'scoring' | 'disagreements'>('agents');
  const [highlighted, setHighlighted] = useState<string | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (highlightAgent) {
      setActiveTab('agents');
      setHighlighted(highlightAgent);
      const el = document.getElementById(`agent-${highlightAgent}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setHighlighted(null);
    }
  }, [highlightAgent]);

  const TabButton = ({ id, label }: { id: 'agents' | 'scoring' | 'disagreements'; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 px-4 py-2 text-sm transition-colors ${
        activeTab === id ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/50"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClose()}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-white h-full shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Agent Glossary</h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex border-b">
          <TabButton id="agents" label="Agent Types" />
          <TabButton id="scoring" label="Scoring Logic" />
          <TabButton id="disagreements" label="Disagreements" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'agents' && (
            <ul className="p-4 space-y-3 text-sm text-gray-700">
              {agentRegistry.map(({ name, description }) => (
                <li
                  key={name}
                  id={`agent-${name}`}
                  className={`p-2 rounded ${highlighted === name ? 'bg-yellow-100' : ''}`}
                >
                  <AgentTooltip name={name}>
                    <strong>{formatAgentName(name)}</strong>
                  </AgentTooltip>
                  : {description}
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'scoring' && (
            <div className="p-4 text-sm text-gray-700 space-y-2">
              <p>Each agent returns a confidence score between 0 and 1 indicating its preference for a team.</p>
              <p>Scores are weighted and combined to derive an overall pick confidence.</p>
            </div>
          )}
          {activeTab === 'disagreements' && (
            <div className="p-4 text-sm text-gray-700 space-y-2">
              <p>Agents may disagree when evaluating the same matchup.</p>
              <p>The guardianAgent flags conflicting signals so you can review potential risks.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ExplanationGlossary;


