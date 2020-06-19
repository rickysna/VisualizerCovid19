const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const releaseConfigs = require('./webpack.release')();

module.exports = (env) => {
    function getWebpackPlugins(env) {
        const plugins = releaseConfigs.getWebpackPlugins(env);
        return plugins.concat([
            new BundleAnalyzerPlugin()
        ]);
    }

    return {
        getOutputConfig: releaseConfigs.getOutputConfig,
        getWebpackPlugins
    }
};
