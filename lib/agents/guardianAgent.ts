import { AgentOutputs, AgentResult, Matchup } from '../types';

/**
 * Reviews previous agent outputs for inconsistencies or missing data
 * and returns any warnings discovered. Does not contribute to scoring
 * but surfaces potential issues with agent reasoning.
 */
export const guardianAgent = async (
  matchup: Matchup,
  agents: Partial<AgentOutputs> = {}
): Promise<AgentResult> => {
  const warnings: string[] = [];
  const results = Object.entries(agents);

  if (results.length === 0) {
    warnings.push('No agent outputs available for review.');
  } else {
    // Check for missing reasoning
    for (const [name, result] of results) {
      if (!result.reason || result.reason.trim().length < 5) {
        warnings.push(`Agent ${name} provided incomplete reasoning.`);
      }
    }

    // Check if agents disagree on predicted winner
    const teams = new Set(results.map(([_, r]) => r.team));
    if (teams.size > 1) {
      warnings.push('Agents disagree on the predicted winner.');
    }
  }

  return {
    team: matchup.homeTeam,
    score: 0,
    reason: 'Guardian review completed',
    warnings: warnings.length > 0 ? warnings : undefined,
  };
};

export default guardianAgent;
