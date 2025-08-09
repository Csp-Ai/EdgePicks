/// <reference types="node" />

import { getClient } from '../lib/server/cache';

interface Options {
  all?: boolean;
  key?: string;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--all') opts.all = true;
    else if (arg === '--key' && argv[i + 1]) {
      opts.key = argv[++i];
    }
  }
  return opts;
}

export async function main(argv = process.argv.slice(2)) {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_PROD_CACHE_PURGE !== '1'
  ) {
    throw new Error(
      'Refusing to purge cache in production without ALLOW_PROD_CACHE_PURGE=1',
    );
  }
  const { all, key } = parseArgs(argv);
  if (!all && !key) {
    console.log('Specify --all or --key <value>');
    return;
  }
  const client: any = await getClient();
  const pattern = all ? '*' : key!;
  const keys: string[] = await client.keys(pattern);
  if (keys.length === 0) {
    console.log('No matching keys');
  } else {
    await client.del(...keys);
    console.log(`Purged ${keys.length} key(s)`);
  }
  if (typeof client.quit === 'function') await client.quit();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
