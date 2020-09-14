const path = require("path");

module.exports = (defaultConfig, env) => {
  const isProductionEnv = env === "production";

  const overrides = [
    config => ({
      ...config,
      mode: "production",
      devtool: false, // "source-map",
      output: {
        ...config.output,
        path: path.resolve(__dirname, "../src/main/resources/client"),
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        publicPath: "/"
      }
    })
  ];

  const _overrides = overrides.reduce(
    (config, func) => func(config, env),
    defaultConfig
  );
  _overrides.plugins[5].options.filename = "[name].css";
  _overrides.plugins[5].options.chunkFilename = "[name].css";

  return _overrides;
};
