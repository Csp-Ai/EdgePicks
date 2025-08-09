import { Env } from './config/env';

const TSDbV1 = (path: string) =>
  `https://www.thesportsdb.com/api/v1/json/${Env.apiKey}/${path}`;

const TSDbV2 = (path: string) => ({
  url: `https://www.thesportsdb.com/api/v2/json/${path}`,
  headers: { 'X-API-KEY': Env.apiKey },
});

export function sportsApi(path: string): { url: string; headers?: Record<string, string> } {
  if (Env.provider === 'thesportsdb') {
    return Env.tdbVersion === 1
      ? { url: TSDbV1(path) }
      : TSDbV2(path);
  }
  return {
    url: `https://api.sportsdata.io/${path}`,
    headers: { 'Ocp-Apim-Subscription-Key': Env.apiKey },
  };
}
