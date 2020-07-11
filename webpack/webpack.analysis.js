const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const releaseConfigs = require("./webpack.release")();

module.exports = () => {
  function getWebpackPlugins(env) {
    const plugins = releaseConfigs.getWebpackPlugins(env);
    return plugins.concat([
      new BundleAnalyzerPlugin(),
    ]);
  }

  return {
    getOutputConfig: releaseConfigs.getOutputConfig,
    getWebpackPlugins,
  };
};
