import React, { Suspense, useMemo, useState, useEffect } from "react";
import type { RemoteModule } from "../types/manifest";
import { loadRemoteEntry, loadRemoteModule } from "../mf/federation";

type Props = {
  module: RemoteModule;
};

export default function RemotePage({ module }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setError(null);

        // 1. Load remoteEntry.js
        await loadRemoteEntry(module.name, module.entry);

        if (!cancelled) {
          setReady(true);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Load remote failed");
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [module]);

  // 2. Lazy load module sau khi remoteEntry đã sẵn sàng
  const Component = useMemo(() => {
    if (!ready) return null;

    // Dynamically import the remote module and adapt it for React.lazy
    return React.lazy(async () => {
      try {
        const exposePath = module.expose || "./App";
        const remote = await loadRemoteModule(module.name, exposePath);
        // Ensure the returned object has a default export
        return { default: (remote as any).default ?? remote };
      } catch (ex) {
        setError(
          `Failed to load remote module ${module.name}/${module.expose || "./App"}: ${ex}`,
        );
        // Fallback component
        return { default: () => null };
      }
    });
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

  // 4. Loading state (remoteEntry chưa load xong)
  if (!ready || !Component) {
    return <div>Loading module {module.name}...</div>;
  }

  // 5. Render remote module
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <Component />
    </Suspense>
  );
}
