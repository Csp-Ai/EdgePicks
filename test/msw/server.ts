import { setupServer } from 'msw/node';
import { sportsHandlers } from './handlers/sportsHandlers';

export const server = setupServer(...sportsHandlers);
