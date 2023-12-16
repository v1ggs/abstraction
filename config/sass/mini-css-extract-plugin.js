// https://www.npmjs.com/package/mini-css-extract-plugin
// MiniCssExtractPlugin can't be used with style-loader
// This plugin extracts CSS into separate files.
// It creates a CSS file per JS file which contains CSS.
// It supports On-Demand-Loading of CSS and SourceMaps.
// Note that if you import CSS from your webpack entrypoint
// or import styles in the initial chunk, mini-css-extract-plugin
// will not load this CSS into the page. Please use
// html-webpack-plugin for automatic generation link tags or
// create index.html file with link tag.
const { config } = require('../../utils/get-config');
const { isProduction } = require('../../utils/abstraction');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const filename = isProduction ? '[name].[contenthash].css' : '[name].css';
const chunkFilename = '[id].[contenthash].css';

module.exports = {
   plugin: () =>
      new miniCssExtractPlugin({
         // output CSS file
         filename: config.paths.DIST.css + '/' + filename,

         // non-entry chunk files
         chunkFilename: config.paths.DIST.css + '/' + chunkFilename,
      }),

   loader: miniCssExtractPlugin.loader,
};
