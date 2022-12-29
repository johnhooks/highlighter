import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import sucrase from "@rollup/plugin-sucrase";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";

import { getBundleBanner } from "./getBundleBanner.mjs";

const BUILD_MODES = ["development", "production"];
const extensions = [".js", ".ts", ".json"];

function createRollupConfig({ mode, format, input, pkg, config }) {
  if (!BUILD_MODES.includes(mode)) {
    throw new Error(`The Rollup configuration ${JSON.stringify(mode)} mode is not supported.`);
  }

  const bundles = [];

  if (format === "cjs") {
    bundles.push({
      ...config,
      input: "../../scripts/rollup/cjs.js",
      output: {
        file: `dist/cjs/${input}.js`,
        format,
        sourcemap: false,
        ...config.output,
      },
      plugins: [
        replace({
          preventAssignment: false,
          delimiters: ["", ""],
          values: {
            __BUNDLE__: input,
          },
        }),
        json(),
        resolve({
          extensions,
        }),
        sucrase({
          exclude: ["node_modules/**"],
          transforms: ["typescript"],
        }),
        filesize({
          showMinifiedSize: false,
          showGzippedSize: true,
        }),
        ...(config.plugins || []),
      ].filter(Boolean),
    });
  }

  bundles.push({
    ...config,
    input: `src/${input}.ts`,
    output: {
      file: `dist/${format}/${input}.${mode}.js`,
      format,
      sourcemap: true,
      name: pkg.name,
      banner: getBundleBanner(pkg),
      ...config.output,
    },
    plugins: [
      replace({
        preventAssignment: false,
        delimiters: ["", ""],
        values: {
          "process.env.NODE_ENV": JSON.stringify(mode),
          "@dinerojs": "@dinero.js",
        },
      }),
      json(),
      resolve({
        extensions,
      }),
      sucrase({
        exclude: ["node_modules/**"],
        transforms: ["typescript"],
      }),
      mode === "production" && terser({ sourceMap: true }),
      filesize({
        showMinifiedSize: false,
        showGzippedSize: true,
      }),
      ...(config.plugins || []),
    ].filter(Boolean),
  });

  return bundles;
}

export function createRollupConfigs({ pkg, inputs = ["index"], config = {} }) {
  return inputs
    .map((input) => {
      return [
        createRollupConfig({
          mode: "development",
          format: "umd",
          input,
          pkg,
          config,
        }),
        createRollupConfig({
          mode: "production",
          format: "umd",
          input,
          pkg,
          config,
        }),
        createRollupConfig({
          mode: "development",
          format: "cjs",
          input,
          pkg,
          config,
        }),
        createRollupConfig({
          mode: "production",
          format: "cjs",
          input,
          pkg,
          config,
        }),
      ];
    })
    .flat(2);
}
