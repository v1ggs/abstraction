const { config } = require('../../utils/get-config');
const webpackBundleAnalyzer =
   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Visualize size of webpack output files with an interactive zoomable treemap.
module.exports = filename => {
   return process.env.ABSTRACTION_SERVE
      ? () => void 0
      : new webpackBundleAnalyzer({
           // Filename has to be an .html file.
           analyzerMode: 'static',
           reportFilename: config.paths.LOGS + '/' + filename,
           openAnalyzer: false,
        });
};
