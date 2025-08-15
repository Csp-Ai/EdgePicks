export interface Kpis {
  usersHelped: number;
  avgAccuracy: number;
  co2Saved: number;
}

export function getKpis(): Kpis {
  const users = Number(process.env.NEXT_PUBLIC_KPI_USERS) || 1024;
  const accuracy = Number(process.env.NEXT_PUBLIC_KPI_ACCURACY) || 85;
  const co2 = Number(process.env.NEXT_PUBLIC_KPI_CO2) || 1200;
  return { usersHelped: users, avgAccuracy: accuracy, co2Saved: co2 };
}
