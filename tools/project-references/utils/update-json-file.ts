import fs from "fs";
// import prettier from "prettier";
import stripJsonComments from "strip-json-comments";

import { deepEqual } from "./helpers";

export const updateJsonFile = <T extends Record<string, unknown>>(
  path: string,
  transformJson: (config: T) => T
) => {
  if (!fs.existsSync(path)) {
    throw new Error(`Cannot find ${path} to update`);
  }

  const json = fs.readFileSync(path, "utf8");
  const parsedJson = JSON.parse(stripJsonComments(json)) as T;

  const transformedJson = transformJson(parsedJson);

  if (!deepEqual(parsedJson, transformedJson)) {
    const updatedJson = JSON.stringify(transformedJson, null, 2);
    fs.writeFileSync(path, updatedJson, "utf8");
    // const prettyUpdatedJson = prettier.format(updatedJson, {
    //   parser: "json",
    // });
    // fs.writeFileSync(path, prettyUpdatedJson, "utf8");
    return true;
  }

  return false;
};
