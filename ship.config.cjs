module.exports = {
  publishCommand({ tag }) {
    return `yarn publish --access public --tag ${tag}`;
  },
  // Skip preparation if it contains only `chore` commits
  shouldPrepare({ releaseType, commitNumbersPerType }) {
    const { fix = 0 } = commitNumbersPerType;

    return releaseType !== "patch" || fix !== 0;
  },
};
