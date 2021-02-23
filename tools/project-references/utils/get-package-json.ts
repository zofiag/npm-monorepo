import { PackageJSON } from "../types";

const packageJSONMap: { [location: string]: PackageJSON } = {};

export const getPackageJson = (location: string) => {
  if (packageJSONMap[location]) {
    return packageJSONMap[location];
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJSON = require(`${process.cwd()}/${location}/package.json`);
  packageJSONMap[location] = packageJSON;

  return packageJSON;
};
