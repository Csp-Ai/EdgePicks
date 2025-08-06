import React from 'react';
import type { GetServerSideProps } from 'next';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import fs from 'fs';
import path from 'path';
import PredictionsPanel from '../components/PredictionsPanel';
import { authOptions } from './api/auth/[...nextauth]';

interface Props {
  session: Session;
}

const PredictionsPage: React.FC<Props> = ({ session }) => (
  <main className="min-h-screen bg-gray-50 p-6">
    <PredictionsPanel session={session} />
  </main>
);

export default PredictionsPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/auth/signin', permanent: false } };
  }
  try {
    const logPath = path.join(process.cwd(), 'llms.txt');
    const entry = `${new Date().toISOString()} - [PREDICTIONS] - ${
      session.user?.name || 'anonymous'
    }\n`;
    await fs.promises.appendFile(logPath, entry);
  } catch (err) {
    console.error('failed to log visit', err);
  }
  return { props: { session } };
};
