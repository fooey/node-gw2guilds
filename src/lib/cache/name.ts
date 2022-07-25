import LRU from 'lru-cache';
import { Duration } from 'luxon';

export const nameCache = new LRU({
  max: 1000,

  // how long to live in ms
  ttl: Duration.fromObject({ minutes: 10 }).as('milliseconds'),

  allowStale: false,
  updateAgeOnGet: true,
});
