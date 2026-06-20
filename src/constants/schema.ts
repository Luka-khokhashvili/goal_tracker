/**
 * Bump this whenever the shape of PersistedState changes in a
 * backwards-incompatible way. The storage layer (Phase 4) reads the stored
 * version and runs migrations up to this number, so old saved data never
 * white-screens the app.
 */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * The single localStorage key under which the whole app state is persisted.
 * Bumped to v2 when money moved from a single USD base to per-type native
 * currencies (goal=USD, contributions=GEL) — pre-v2 amounts had different
 * semantics, so we start fresh rather than mis-read them.
 */
export const STORAGE_KEY = 'moto-savings-tracker:v2';
