import { setupServer } from 'msw/node';
import { sportsHandlers } from './handlers/sportsHandlers';
import { githubHandlers } from './handlers/githubHandlers';
import { supabaseHandlers } from './handlers/supabaseHandlers';
export const server = setupServer(
  ...sportsHandlers,
  ...githubHandlers,
  ...supabaseHandlers,
);
