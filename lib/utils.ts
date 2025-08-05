export const getContribution = (score: number, weight: number): number => {
  return score * weight;
};

export const formatAgentName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);
