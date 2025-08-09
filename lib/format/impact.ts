export function formatCO2(grams: number, fractionDigits = 2): string {
  if (!Number.isFinite(grams)) return '0 kg';
  const kg = grams / 1000;
  const factor = 10 ** fractionDigits;
  const rounded = Math.round(kg * factor) / factor;
  return `${rounded.toFixed(fractionDigits)} kg`;
}

export function formatTimeSaved(minutes: number, fractionDigits = 1): string {
  if (!Number.isFinite(minutes)) return '0 h';
  const hours = minutes / 60;
  const factor = 10 ** fractionDigits;
  const rounded = Math.round(hours * factor) / factor;
  return `${rounded.toFixed(fractionDigits)} h`;
}
