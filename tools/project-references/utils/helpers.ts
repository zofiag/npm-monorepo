import { exec } from "child_process";

export const execute = async (command: string) => {
  const output = new Promise((resolve) => {
    exec(command, function(error, stdout) {
      if (error) {
        throw new Error(error.message);
      }
      resolve(stdout);
    });
  });
  return output;
};

export const deepEqual = (a: any, b: any) =>
  JSON.stringify(a) === JSON.stringify(b);
