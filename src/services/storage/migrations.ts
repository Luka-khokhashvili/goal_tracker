import { CURRENT_SCHEMA_VERSION } from '@/constants/schema';

/**
 * Brings an unknown blob read from storage up to the CURRENT schema version.
 *
 * Today there's only v1, so this is a pass-through that stamps the version.
 * The structure is here so that when the schema changes, each step is a small,
 * isolated transform — old saved data migrates forward instead of being
 * discarded or crashing the app.
 *
 * Note: additive fields (e.g. a newly introduced `exchangeRates`) don't need a
 * migration step — the Zod schema's `.default()` fills them in on parse. Write
 * a step here only for renames/removals/reshapes.
 */
export function migrate(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) return data;
  const state = data as Record<string, unknown>;
  let version = typeof state.schemaVersion === 'number' ? state.schemaVersion : 0;

  // while (version < CURRENT_SCHEMA_VERSION) {
  //   switch (version) {
  //     case 1: /* transform v1 -> v2 */; version = 2; break;
  //   }
  // }
  void version;

  return { ...state, schemaVersion: CURRENT_SCHEMA_VERSION };
}
