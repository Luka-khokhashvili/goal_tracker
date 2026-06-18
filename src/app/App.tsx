/**
 * Phase 2 placeholder shell.
 * This is a smoke test confirming the toolchain works: Tailwind compiles,
 * theme tokens resolve, dark mode is on. Real app structure arrives in later
 * phases (providers, layout, dashboard).
 */
export default function App() {
  return (
    <div className="min-h-full grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
        <p className="text-sm font-medium uppercase tracking-wider text-brand">
          Phase 2 · Setup complete
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-content">
          Moto Savings Tracker
        </h1>
        <p className="mt-3 text-sm text-muted">
          Vite · React · TypeScript · Tailwind are wired up. Theme tokens and
          dark mode are live. Ready for Phase 3 (types &amp; models).
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <span className="h-3 w-3 rounded-full bg-success" />
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span className="h-3 w-3 rounded-full bg-danger" />
          <span className="h-3 w-3 rounded-full bg-brand" />
        </div>
      </div>
    </div>
  );
}
