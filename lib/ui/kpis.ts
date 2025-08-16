export interface Kpis {
  usersHelped: number;
  avgAccuracy: number;
  co2Saved: number;
}

export const demoKpis: Kpis = {
  usersHelped: 1024,
  avgAccuracy: 85,
  co2Saved: 1200,
};

export function getKpis(): Kpis {
  const users = Number(process.env.NEXT_PUBLIC_KPI_USERS);
  const accuracy = Number(process.env.NEXT_PUBLIC_KPI_ACCURACY);
  const co2 = Number(process.env.NEXT_PUBLIC_KPI_CO2);
  return {
    usersHelped: users || demoKpis.usersHelped,
    avgAccuracy: accuracy || demoKpis.avgAccuracy,
    co2Saved: co2 || demoKpis.co2Saved,
  };
}
