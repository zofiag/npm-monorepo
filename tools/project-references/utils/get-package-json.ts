import { PackageJSON } from "../types";

const packageJSONMap: { [location: string]: PackageJSON } = {};

export const getPackageJson = (location: string) => {
  if (packageJSONMap[location]) {
    return packageJSONMap[location];
  }

  const packageJSON = require(`${__dirname}/../${location}/package.json`);
  packageJSONMap[location] = packageJSON;

  return packageJSON;
};
