module.exports = {
  "**/*.ts": () => "yarn run check",
  "**/*.(js|cjs|mjs|ts)": (filenames) => [
    `eslint --ext .js,.cjs,.mjs,.ts --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],
};
