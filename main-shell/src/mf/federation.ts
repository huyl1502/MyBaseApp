// mf/federation.ts

const remotes = new Map<string, any>();

export async function loadRemoteEntry(remoteName: string, url: string) {
  if (remotes.has(remoteName)) {
    return remotes.get(remoteName);
  }

  const remote = await import(
    /* @vite-ignore */
    url
  );

  // Khởi tạo shared scope
  await remote.init?.({});

  remotes.set(remoteName, remote);

  return remote;
}

export async function loadRemoteModule(remoteName: string, expose: string) {
  const remote = remotes.get(remoteName);

  if (!remote) {
    throw new Error(`Remote '${remoteName}' chưa được load`);
  }

  const factory = await remote.get(expose);

  return factory();
}
