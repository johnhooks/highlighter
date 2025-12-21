module.exports = {
  "**/*.ts": () => "pnpm run check",
  "**/*.(js|cjs|mjs|ts)": (filenames) => [
    `eslint --fix ${filenames.join(" ")}`,
    `prettier --write ${filenames.join(" ")}`,
  ],
};
