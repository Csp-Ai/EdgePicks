/**
 * Calculates a contribution for an agent's score based on its weight.
 *
 * @param score - The agent's score.
 * @param weight - The weight applied to the score.
 * @returns The weighted contribution.
 *
 * @example
 * ```ts
 * getContribution(0.8, 0.5);
 * // => 0.4
 * ```
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const getContribution = (score: number, weight: number): number => {
  return score * weight;
};

/**
 * Formats an agent name by capitalizing the first character.
 *
 * @param name - The agent name to format.
 * @returns The formatted agent name with the first letter capitalized.
 *
 * @example
 * ```ts
 * formatAgentName('injuryScout');
 * // => 'InjuryScout'
 * ```
 */
export const formatAgentName = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

/**
 * Combines CSS class names into a single string, omitting falsey values.
 *
 * @param classes - List of class names or falsey values.
 * @returns A space-separated string of truthy class names.
 *
 * @example
 * ```ts
 * cn('btn', undefined, 'active');
 * // => 'btn active'
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
