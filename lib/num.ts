export const toNum = (v: string | number | undefined | null) =>
  typeof v === "string" ? Number(v) : v ?? 0;
