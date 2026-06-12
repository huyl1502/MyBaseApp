import { init, loadRemote, registerRemotes } from '@module-federation/enhanced/runtime';

let initialized = false;

export async function loadRemoteEntry(remoteName: string, url: string) {
  if (!initialized) {
    init({
      name: 'shell',
      remotes: []
    });
    initialized = true;
  }

  registerRemotes([
    {
      name: remoteName,
      entry: url,
      type: 'module' // since it's built by vite
    }
  ]);
}

export async function loadRemoteModule(remoteName: string, expose: string): Promise<any> {
  const moduleName = expose.startsWith('./') ? expose.slice(2) : expose;
  const remotePath = `${remoteName}/${moduleName}`;

  const remote = await loadRemote(remotePath);

  if (!remote) {
    throw new Error(`Remote '${remoteName}' module '${expose}' chưa được load`);
  }

  // `loadRemote` returns the module directly, not a factory function
  return remote;
}
