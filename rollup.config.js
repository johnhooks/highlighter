import pkg from "./package.json" assert { type: "json" };
import { createRollupConfigs } from "./scripts/rollup/config.js";

export default createRollupConfigs({ pkg });
