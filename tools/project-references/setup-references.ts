import { execute } from "./utils/general";
import {
  setupReferences,
  updateTSConfigReferencesIfChanged,
} from "./utils/ts-references";

const CYCLES_MAX_COUNT = 500;

const setupTSConfigReferences = async () => {
  const runDetails = [];
  let cycle = 0;
  let lastPassActions;

  try {
    console.log("Generating packages references");
    const workspacesInfo = await execute("yarn workspaces info");

    let packages = JSON.parse(workspacesInfo.match(/\{[\s\S]*\}/)[0]);

    setupReferences(packages);
    const packageNames = Object.keys(packages);

    console.log(
      `⏰ Setting up references for ${packageNames.length} package${
        packageNames.length === 1 ? "" : "s"
      }`
    );

    let resolvedReferences = [];
    const leafPackages = [];
    const resolvedRefs = {};

    for (let i = 0; i < packageNames.length; i = ++i % packageNames.length) {
      if (i == 0) {
        cycle++;
        lastPassActions = [
          `cycle ${cycle} resolved count ${resolvedReferences.length} packages count ${packageNames.length}`,
        ];
      }

      lastPassActions.push(`Processing ${packageNames[i]}`);

      const name = packageNames[i];
      const pkg = packages[name];

      if (resolvedRefs[name]) {
        continue;
      }

      const packageJSON = getPackageJson(pkg.location);
      const devDependencies = Object.keys(packageJSON.devDependencies || {});

      const resolvedCount = pkg.workspaceDependencies.reduce(
        (resolved, refName) => {
          if (resolvedRefs[refName] || devDependencies.includes(refName)) {
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
        leafPackages.push(pkg);
        resolvedRefs[name] = true;
        resolvedReferences.push({
          name,
          ...pkg,
        });
      } else {
        resolvedRefs[name] = false;
      }

      if (resolvedReferences.length === packageNames.length) {
        break;
      }

      if (cycle === CYCLES_MAX_COUNT) {
        throw new Error("🚨 Circular dependency detected");
      }
    }

    resolvedReferences = resolvedReferences.filter((ref) =>
      ref.name.includes("@graphyapp/")
    );

    const referencePaths = resolvedReferences.map((ref) => ({
      path: `./${ref.location}`,
    }));

    updateTSConfigReferencesIfChanged(
      `${__dirname}/../tsconfig.build.json`,
      referencePaths,
      false
    );
  } catch (e) {
    runDetails.push("\nFinal run was:");
    runDetails.push(...lastPassActions);
    console.log(runDetails.join("\n"));
    console.error(`\n${e.message}\n`);
    process.exit(1);
  }

  console.log(`👷 ${cycle} cycles to complete topological sort of the project`);
};

setupTSConfigReferences();
