export const getContribution = (score: number, weight: number): number => {
  return score * weight;
};

export const formatAgentName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

export const cn = (
  ...classes: Array<string | undefined | null | false>
): string => classes.filter(Boolean).join(' ');
