import { GetServerSideProps } from 'next';
import AccuracyTrend, { AccuracyHistory } from '../../components/AccuracyTrend';

interface Props {
  fallbackData: AccuracyHistory;
}

const AccuracyAnalyticsPage: React.FC<Props> = ({ fallbackData }) => (
  <main className="min-h-screen p-6 bg-gray-50" suppressHydrationWarning>
    <header className="text-center mb-8">
      <h1 className="text-3xl font-mono font-bold">Accuracy Trends</h1>
      <p className="text-gray-600">Weekly accuracy per agent and overall</p>
    </header>
    <AccuracyTrend fallbackData={fallbackData} />
  </main>
);

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const baseUrl = req.headers.host ? `http://${req.headers.host}` : '';
  try {
    const res = await fetch(`${baseUrl}/api/accuracy-history`);
    const fallbackData: AccuracyHistory = await res.json();
    return { props: { fallbackData } };
  } catch {
    return { props: { fallbackData: { history: [] } } };
  }
};

export default AccuracyAnalyticsPage;
