import ZScoreCard from '../../components/edu/ZScoreCard';
import ConfidenceIntervalCard from '../../components/edu/ConfidenceIntervalCard';
import BiasCard from '../../components/edu/BiasCard';
import ErrorBarsCard from '../../components/edu/ErrorBarsCard';

export default function LearnStatsPage() {
  return (
    <main className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <ZScoreCard />
      <ConfidenceIntervalCard />
      <BiasCard />
      <ErrorBarsCard />
    </main>
  );
}
