export type NormalizedOdds = { homeSpread?: number; awaySpread?: number; total?: number };
export function toNormalizedOdds(v: any): NormalizedOdds {
  return {
    homeSpread: v?.spread?.home ?? v?.homeSpread,
    awaySpread: v?.spread?.away ?? v?.awaySpread,
    total: v?.total ?? v?.overUnder,
  };
}
