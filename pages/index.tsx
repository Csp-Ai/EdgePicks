import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TypographyH1, TypographyMuted } from '../components/ui/typography';
import MatchupCard from '../components/MatchupCard';
import type { AgentOutputs } from '../lib/types';

const dummyAgents: AgentOutputs = {
  injuryScout: { team: 'Team A', score: 0.2, reason: 'Fewer injuries' },
  lineWatcher: { team: 'Team A', score: 0.1, reason: 'Line movement' },
  statCruncher: { team: 'Team A', score: 0.05, reason: 'Better stats' },
  trendsAgent: { team: 'Team A', score: 0.05, reason: 'Trend analysis' },
  guardianAgent: { team: 'Team A', score: 0, reason: 'No warnings' },
};

const dummyResult = {
  winner: 'Team A',
  confidence: 0.4,
  topReasons: ['Fewer injuries', 'Line movement'],
  agents: dummyAgents,
};

export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-neutral-950 text-white">
      <div className="max-w-3xl mx-auto py-16 space-y-6 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <TypographyH1>Welcome to EdgePicks</TypographyH1>
          <TypographyMuted>
            AI-powered predictions. Transparent. Competitive. Built for Pick’em players.
          </TypographyMuted>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ scale: 1.05 }}>
          <Link href="/matchups/public">
            <Button variant="primaryCTA">Explore Matchups</Button>
          </Link>
        </motion.div>
        <div className="pt-8 space-y-4">
          <TypographyMuted>Preview our AI-powered analysis below</TypographyMuted>
          <div className="relative">
            <Card>
              <MatchupCard teamA="Lakers" teamB="Warriors" result={dummyResult} />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
