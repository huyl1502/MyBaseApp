export interface RemoteModule {
  name: string;
  entry: string;
  expose?: string;
}

export interface Manifest {
  modules: RemoteModule[];
}
