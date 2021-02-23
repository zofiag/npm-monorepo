import fs from "fs";
import path from "path";

import {
  TSConfigReference,
  WorkspacePackage,
  WorkspacePackages,
} from "../types";

import { getPackageJson } from "./get-package-json";
import { updateTSConfigJSON } from "./update-ts-config";

export const setupPackageReferences = (
  pkg: WorkspacePackage,
  packages: WorkspacePackages
) => {
  const packageJSON = getPackageJson(pkg.location);
  const devDependencies = Object.keys(packageJSON.devDependencies || {});

  const filteredDependencies = pkg.workspaceDependencies.filter(
    (dependency) => !devDependencies.includes(dependency)
  );

  const references = filteredDependencies.reduce((acc, dependency) => {
    const dependencyPkg = packages[dependency];

    const from = pkg.location;
    const to = dependencyPkg.location;
    const relativePath = path.relative(from, to);
    return [...acc, { path: relativePath }];
  }, [] as TSConfigReference[]);

  const tsconfigFile = path.resolve(
    `${__dirname}/../${pkg.location}/tsconfig.json`
  );

  if (fs.existsSync(tsconfigFile)) {
    updateTSConfigJSON(tsconfigFile, references);
  }
};
