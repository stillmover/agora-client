module.exports = {
  plugins: ["feature-sliced", "import"],
  settings: {
    "import/resolver": {
      typescript: true,
    },
  },
  rules: {
    "feature-sliced/layers-slices": "error",
    "feature-sliced/public-api": "error",
  },
};
