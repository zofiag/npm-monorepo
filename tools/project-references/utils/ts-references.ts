import { updateJsonFileIfChanged, getPackageJson } from "./json-file";

export const updateTSConfigReferencesIfChanged = (
  tsConfigFile,
  references,
  silent = true
) => {
  const hasChanged = updateJsonFileIfChanged(tsConfigFile, (tsConfigObj) => {
    return { ...tsConfigObj, references };
  });

  if (!hasChanged && !silent) {
    console.log("No changes detected");
  }

  return hasChanged;
};

export const setupReferences = (packages) => {
  const packageNames = Object.keys(packages);

  packageNames.forEach((pkgName) => {
    const pkg = packages[pkgName];
    const packageJSON = getPackageJson(pkg.location);
    const devDependencies = Object.keys(packageJSON.devDependencies || {});

    const filteredDependencies = pkg.workspaceDependencies.filter(
      (dependency) => !devDependencies.includes(dependency)
    );
    const references = filteredDependencies.reduce((acc, dependency) => {
      const dependencyPackage = packages[dependency];

      const from = pkg.location;
      const to = dependencyPackage.location;
      const relativePath = path.relative(from, to);
      return [...acc, { path: relativePath }];
    }, []);

    const tsconfigFile = path.resolve(
      `${__dirname}/../${pkg.location}/tsconfig.json`
    );

    if (fs.existsSync(tsconfigFile)) {
      updateTSConfigReferencesIfChanged(tsconfigFile, references);
    }
  });
};
