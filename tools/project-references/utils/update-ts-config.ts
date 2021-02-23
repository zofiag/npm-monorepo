import { TSConfigReference } from "../types";

import { updateJsonFile } from "./update-json-file";

export const updateTSConfigJSON = (
  tsConfigFile: string,
  references: TSConfigReference[],
  silent = true
) => {
  const hasChanged = updateJsonFile(tsConfigFile, (tsConfigObj) => {
    return { ...tsConfigObj, references };
  });

  if (!hasChanged && !silent) {
    console.log("No changes detected");
  }

  return hasChanged;
};
