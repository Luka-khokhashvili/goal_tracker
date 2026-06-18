/**
 * Bump this whenever the shape of PersistedState changes in a
 * backwards-incompatible way. The storage layer (Phase 4) reads the stored
 * version and runs migrations up to this number, so old saved data never
 * white-screens the app.
 */
export const CURRENT_SCHEMA_VERSION = 1;

/** The single localStorage key under which the whole app state is persisted. */
export const STORAGE_KEY = 'moto-savings-tracker:v1';
