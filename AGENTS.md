# Agents

Last Updated: 2025-08-05

| Name | Purpose | Type | Weight | Sources | Special Notes |
| --- | --- | --- | --- | --- | --- |
| injuryScout | Tracks player injuries and availability. | injury | 0.5 | espn, teamReports | — |
| lineWatcher | Monitors betting line movement and market signals. | line | 0.3 | marketData | — |
| statCruncher | Crunches historical statistics for trends. | stat | 0.2 | statsApi | — |
| trendsAgent | Analyzes recent matchups for flow popularity and agent hit rates. | analytics | 0 | supabase | Analytics agent (weight 0) |
| guardianAgent | Reviews outputs for inconsistent or incomplete reasoning. | guardian | 0 | — | Quality control agent (weight 0) |

## Special-Purpose Agents

trendsAgent and guardianAgent operate with a weight of 0 to handle analytics and quality control, respectively.

