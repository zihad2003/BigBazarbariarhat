/**
 * Database entry point.
 *
 * To swap backends:
 *   1. Create a new file in adapters/ that implements IDatabaseAdapter
 *   2. Import and assign it here instead of mockAdapter
 *
 * Example (Prisma):
 *   import { prismaAdapter } from './adapters/prisma';
 *   export const db = prismaAdapter;
 *
 * Example (Supabase):
 *   import { supabaseAdapter } from './adapters/supabase';
 *   export const db = supabaseAdapter;
 */

import { mockAdapter } from './adapters/mock';
import type { IDatabaseAdapter } from './types';

export const db: IDatabaseAdapter = mockAdapter;

export type { IDatabaseAdapter } from './types';
export type {
  ProductRecord,
  ProductFilters,
  ProductCreateInput,
  OrderRecord,
  OrderCreateInput,
  OrderFilters,
  CategoryRecord,
  CouponRecord,
  ReviewRecord,
  PaginatedResult,
} from './types';
