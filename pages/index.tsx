import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { TypographyH1, TypographyMuted } from '../components/ui/typography';
import { FADE_DURATION, EASE } from '../lib/animations';
import { logUiEvent } from '../lib/logUiEvent';
import UpcomingGamesPanel from '../components/UpcomingGamesPanel';
import LoadingShimmer from '../components/LoadingShimmer';

const phrases = [
  'AI-powered Picks',
  'Transparent Intelligence',
  'Agent-backed Insights',
];

const features = [
  { title: 'Multi-agent scoring', desc: 'Diverse models collaborate for each pick.' },
  { title: 'Explainable AI', desc: 'See exactly why each agent likes a side.' },
  { title: 'Leaderboard Accuracy', desc: 'Track which agents hit most often.' },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let char = 0;
    const current = phrases[phraseIndex];
    const interval = setInterval(() => {
      if (char <= current.length) {
        setDisplayText(current.slice(0, char));
        char++;
      } else {
        clearInterval(interval);
        setTimeout(
          () => setPhraseIndex((i) => (i + 1) % phrases.length),
          1000,
        );
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phraseIndex]);

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingShimmer lines={3} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-neutral-950 text-white">
      <div className="max-w-3xl mx-auto py-16 space-y-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: FADE_DURATION, ease: EASE }}
          className="space-y-2"
        >
          <TypographyH1>{displayText}</TypographyH1>
          <TypographyMuted>
            AI-powered predictions. Transparent. Competitive. Built for Pick’em players.
          </TypographyMuted>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.9, 1] }}
          transition={{ duration: 2, ease: EASE, repeat: Infinity, repeatDelay: 3 }}
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/matchups/public">
            <Button
              variant="primaryCTA"
              onClick={() => {
                const userId = (session?.user as { id?: string })?.id;
                logUiEvent(
                  'explore_matchups_click',
                  userId ? { user_id: userId } : undefined,
                );
              }}
            >
              Explore Matchups
            </Button>
          </Link>
        </motion.div>

        {!session ? (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Enter a Pick’em Passphrase"
              className="px-4 py-2 rounded text-black"
            />
            <div>
              <Button onClick={() => signIn('google')}>Sign in with Google</Button>
            </div>
          </div>
        ) : (
          <TypographyMuted className="text-lg">Welcome back {session.user?.name}</TypographyMuted>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="p-4 bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-200">{f.desc}</p>
            </Card>
          ))}
        </div>

        <div className="pt-8 space-y-4">
          <TypographyMuted>Preview our AI-powered analysis below</TypographyMuted>
          <div className="relative">
            <UpcomingGamesPanel maxVisible={1} />
          </div>
        </div>
      </div>
    </main>
  );
}
