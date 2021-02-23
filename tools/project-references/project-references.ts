import { setupPackageReferences } from "./utils/setup-package-references";
import { getWorkspaceInfo } from "./utils/get-workspace-info";
import { getPackageJson } from "./utils/get-package-json";
import { updateTSConfigJSON } from "./utils/update-ts-config";

const CYCLES_MAX_COUNT = 500;

const setupTSConfigReferences = async () => {
  const runDetails = [];
  let cycle = 0;

  console.log("🦄 Updating package references 🦝");

  try {
    const { packages } = await getWorkspaceInfo();

    const packageNames = Object.keys(packages);

    console.log(
      `⏰ Setting up references for ${packageNames.length} package${
        packageNames.length === 1 ? "" : "s"
      }`
    );

    let resolvedReferences = [];
    const resolvedRefs: { [name: string]: boolean } = {};

    for (let i = 0; i < packageNames.length; i = ++i % packageNames.length) {
      if (i == 0) {
        cycle++;
      }

      const name = packageNames[i];
      const pkg = packages[name];

      if (resolvedRefs[name]) {
        // package resolved, let's skip to another one
        continue;
      }

      const packageJSON = getPackageJson(pkg.location);

      // reduce dependencies to find number of resolved dependencies
      // if dependency is already a resolved workspace
      // or it is a dev dependency mark as resolved
      const resolvedCount = pkg.workspaceDependencies.reduce(
        (resolved, refName) => {
          if (resolvedRefs[refName] || refName in packageJSON.devDependencies) {
            return resolved + 1;
          }
          return resolved;
        },
        0
      );

      if (
        !pkg.workspaceDependencies.length ||
        resolvedCount === pkg.workspaceDependencies.length
      ) {
        // if workspace has no dependencies or all dependencies are resolved
        // we can mark it as resolved
        // setup back references of dependant packages
        setupPackageReferences(pkg, packages);
        // mark package as resolved
        resolvedRefs[name] = true;
        resolvedReferences.push({
          name,
          ...pkg,
        });
      } else {
        resolvedRefs[name] = false;
      }

      if (resolvedReferences.length === packageNames.length) {
        // all packages resolved, we are done
        break;
      }

      if (cycle === CYCLES_MAX_COUNT) {
        const unresolved = Object.keys(resolvedRefs).filter(
          (name) => !resolvedRefs[name]
        );
        runDetails.push("Unresolved packages:");
        runDetails.push(unresolved);
        throw new Error("🚨 Circular dependency detected");
      }
    }

    resolvedReferences = resolvedReferences.filter((ref) =>
      ref.name.includes("@graphyapp/")
    );

    const referencePaths = resolvedReferences.map((ref) => ({
      path: `./${ref.location}`,
    }));

    updateTSConfigJSON(
      `${__dirname}/../tsconfig.build.json`,
      referencePaths,
      false
    );
  } catch (e) {
    runDetails.push("\nFinal run was:\n");
    console.log(runDetails.join("\n"));
    console.error(`\n${e.message}\n`);
    process.exit(1);
  }

  console.log(`👷 ${cycle} cycles to complete topological sort of the project`);
};

setupTSConfigReferences();
