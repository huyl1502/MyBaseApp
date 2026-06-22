import React, { useEffect, useState } from "react";
import { loadManifest } from "../../mf/manifest";
import RemotePage from "../../components/RemotePage";
import type { RemoteModule } from "../../types/manifest";

export default function MenuPage() {
  const [module, setModule] = useState<RemoteModule | null>(null);

  useEffect(() => {
    loadManifest().then((manifest) => {
      const configModule = manifest.modules.find((m) => m.name === "config");
      if (configModule) {
        setModule({
          ...configModule,
          expose: "./Menu",
        });
      }
    });
  }, []);

  if (!module) return <div>Loading config module info...</div>;

  return <RemotePage module={module} />;
}
