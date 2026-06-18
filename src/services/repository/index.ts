import { LocalStorageRepository } from './LocalStorageRepository';
import type { Repository } from './Repository';

/**
 * The single repository instance the whole app imports.
 *
 * THIS LINE is the Supabase migration seam: swap
 *   new LocalStorageRepository()
 * for
 *   new SupabaseRepository(client)
 * and nothing else in the app changes.
 */
export const repository: Repository = new LocalStorageRepository();

export type { Repository } from './Repository';
