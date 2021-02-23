export type PackageJSON = { [name: string]: unknown } & {
  devDependencies: Record<string, string>;
};

export type TSConfigReference = {
  path: string;
};

export type TSConfigJSON = { [name: string]: unknown } & {
  references: TSConfigReference[];
};

export interface WorkspacePackage {
  location: string;
  workspaceDependencies: string[];
  mismatchedWorkspaceDependencies: string[];
}

export interface WorkspacePackages {
  [name: string]: WorkspacePackage;
}
