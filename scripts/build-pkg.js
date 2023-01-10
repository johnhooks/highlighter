import { exec } from "./utils/exec.js";

if (!process.env.CI) {
  await exec("yarn", ["clean:all"]);
}

try {
  await exec("yarn", ["build:tsc"]);
  await exec("yarn", ["build:esm"]);
  await exec("yarn", ["build:types"]);
} catch (code) {
  process.exit(code);
}

process.exit(0);
