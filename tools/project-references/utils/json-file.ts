import fs from "fs";
import prettier from "prettier";

import stripJsonComments from "strip-json-comments";

import { deepEqual } from "./utils";

const packageJSONMap = {};

export const getPackageJson = (location) => {
  if (packageJSONMap[location]) {
    return packageJSONMap[location];
  }

  const packageJSON = require(`${__dirname}/../${location}/package.json`);
  packageJSONMap[location] = packageJSON;

  return packageJSON;
};

export const updateJsonFileIfChanged = (path, transformJson) => {
  if (!fs.existsSync(path)) {
    throw new Error(`Cannot find ${path} to update`);
  }

  const json = fs.readFileSync(path, "utf8");
  const parsedJson = JSON.parse(stripJsonComments(json));

  const transformedJson = transformJson(parsedJson);

  if (!deepEqual(parsedJson, transformedJson)) {
    const updatedJson = JSON.stringify(transformedJson, null, 2);
    const prettyUpdatedJson = prettier.format(updatedJson, {
      parser: "json",
    });
    fs.writeFileSync(path, prettyUpdatedJson, "utf8");
    return true;
  }

  return false;
};
