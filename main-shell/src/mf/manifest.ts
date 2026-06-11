import type { Manifest } from "../types/manifest";

export async function loadManifest(): Promise<Manifest> {
  const response = await fetch("/mf-manifest.json");

  if (!response.ok) {
    throw new Error("Cannot load manifest");
  }

  return response.json();
}
