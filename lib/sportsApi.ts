import { Env, getSportsApiKey } from './config/env';

export function sportsApi(path: string): {
  url: string;
  headers?: Record<string, string>;
} {
  const key = getSportsApiKey();
  if (Env.provider === 'thesportsdb') {
    return Env.tdbVersion === 1
      ? { url: `https://www.thesportsdb.com/api/v1/json/${key}/${path}` }
      : {
          url: `https://www.thesportsdb.com/api/v2/json/${path}`,
          headers: { 'X-API-KEY': key },
        };
  }
  return {
    url: `https://api.sportsdata.io/${path}`,
    headers: { 'Ocp-Apim-Subscription-Key': key },
  };
}
