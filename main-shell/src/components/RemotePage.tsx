import React, { Suspense, useState, useEffect } from "react";
import type { RemoteModule } from "../types/manifest";
import { loadRemoteEntry, loadRemoteModule } from "../mf/federation";

type Props = {
  module: RemoteModule;
};

export default function RemotePage({ module }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setError(null);
        setReady(false);
        setComponent(null);

        // 1. Load remoteEntry.js
        await loadRemoteEntry(module.name, module.entry);

        if (!cancelled) {
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          const errMsg = err instanceof Error ? err.message : String(err);
          setError(errMsg || "Load remote failed");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [module]);

  // 2. Load module sau khi remoteEntry đã sẵn sàng
  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function load() {
      try {
        const exposePath = module.expose || "./App";
        const remote = await loadRemoteModule(module.name, exposePath);
        
        // Ensure the returned object has a default export
        const remoteModule = remote as { default?: React.ComponentType };
        const LoadedComponent = remoteModule.default ?? (remote as React.ComponentType);

        if (!cancelled) {
          setComponent(() => LoadedComponent);
        }
      } catch (ex) {
        if (!cancelled) {
          const exMsg = ex instanceof Error ? ex.message : String(ex);
          setError(
            `Failed to load remote module ${module.name}/${module.expose || "./App"}: ${exMsg}`,
          );
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [ready, module]);

  // 3. Error state
  if (error) {
    return (
      <div style={{ color: "red" }}>
        ❌ Cannot load module: {module.name}
        <br />
        {error}
      </div>
    );
  }

  // 4. Loading state (remoteEntry hoặc component chưa load xong)
  if (!ready || !Component) {
    return <div>Loading module {module.name}...</div>;
  }

  // 5. Render remote component
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <Component />
    </Suspense>
  );
}
