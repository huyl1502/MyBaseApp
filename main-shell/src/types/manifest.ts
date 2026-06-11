export interface RemoteModule {
  name: string;
  displayName: string;
  route: string;
  entry: string;
  expose: string;
}

export interface Manifest {
  modules: RemoteModule[];
}
