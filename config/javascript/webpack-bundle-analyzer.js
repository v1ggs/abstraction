const webpackBundleAnalyzer =
   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { paths } = require('../webpack/paths');

// Visualize size of webpack output files with an interactive zoomable treemap.
module.exports = (filename) => {
   return process.env.ABSTRACTION_SERVE
      ? () => void 0
      : new webpackBundleAnalyzer({
           // Filename has to be an .html file.
           analyzerMode: 'static',
           reportFilename: paths.LOGS + '/' + filename,
           openAnalyzer: false,
        });
};
