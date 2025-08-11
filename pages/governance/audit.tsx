import Head from 'next/head';
import AuditLogList from '@/components/AuditLogList';

const AuditPage = () => (
  <>
    <Head>
      <title>Governance Audit Log</title>
    </Head>
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Governance Audit Log</h1>
      <AuditLogList />
    </main>
  </>
);

export default AuditPage;

