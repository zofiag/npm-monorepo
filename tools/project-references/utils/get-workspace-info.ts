import { WorkspacePackages } from "../types";

import { execute } from "./helpers";

export const getWorkspaceInfo = async () => {
  const workspacesInfoRaw = (await execute("yarn workspaces info")) as string;
  const workspacesInfo = workspacesInfoRaw.match(/\{[\s\S]*\}/);

  if (!workspacesInfo) {
    throw new Error("🚨 Failed to fetch workspaces info");
  }

  return {
    packages: JSON.parse(workspacesInfo[0]) as WorkspacePackages,
  };
};
