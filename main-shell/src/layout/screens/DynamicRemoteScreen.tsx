import { useEffect, useState } from "react";
import { loadManifest } from "../../mf/manifest";
import RemotePage from "../../components/RemotePage";
import type { RemoteModule } from "../../types/manifest";

interface Props {
  moduleName: string;
  expose: string;
}

export default function DynamicRemoteScreen({ moduleName, expose }: Props) {
  const [module, setModule] = useState<RemoteModule | null>(null);

  useEffect(() => {
    loadManifest().then((manifest) => {
      const targetModule = manifest.modules.find((m) => m.name === moduleName);
      if (targetModule) {
        setModule({
          ...targetModule,
          expose,
        });
      }
    });
  }, [moduleName, expose]);

  if (!module) return <div>Loading {moduleName} module info...</div>;

  return <RemotePage module={module} />;
}
