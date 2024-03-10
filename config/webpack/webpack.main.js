const { config } = require('../../utils/get-config');
// Provides variables in sass files.
// Stingify is requried for sass-loader, even if strings are already srtingified.
process.env.ENV_SASS_GLOBALS = JSON.stringify(config.globals);

const sass = require('../sass');
const js = require('../javascript');
const { devServer } = require('../server');
const common = require('./webpack.common');
const { merge } = require('../../utils/js');
const { templatesLoader, templatesPlugin } = require('../templates');
const {
   isCMS,
   isServing,
   isProduction,
   differentialBuildConfig,
} = require('../../utils/abstraction');
const {
   CopyPlugin,
   DefinePlugin,
   ProgressPlugin,
   WebpackLicensePlugin,
} = require('../../utils/webpack');

const isDifferentialBuild = differentialBuildConfig();

// Global variables for usage in code for this bundle only.
const modernGlobals = merge({}, config.globals);
modernGlobals.ENV_MAIN = true;
modernGlobals.ENV_LEGACY = false;
const bundleExtension = isDifferentialBuild ? '.mjs' : '.js';

const modern = {
   name: 'MAIN', // legacy depends on this (note if changing it).

   // Defaults to 'browserslist' or to 'web' when no browserslist configuration was found.
   // It helps determinate ES-features that may be used to generate a runtime-code
   // (all the chunks and modules are wrapped by runtime code).
   // Webpack won't transpile code with a target configured.
   target: isDifferentialBuild ? ['web', 'es6'] : 'browserslist',

   output: {
      // Clean dist for this bundle and when not serving.
      // The `legacy` bundle will wait for this bundle to finish.
      // If run in parallel, `legacy` files get deleted.
      // This deletes the output, even in memory (when serving).
      clean: isServing
         ? false
         : { keep: JSON.parse(config.globals.assetsJsonFile) },

      filename:
         config.paths.DIST.javascript +
         '/[name]' +
         (isProduction ? '.[contenthash]' : '') +
         bundleExtension,

      chunkFilename:
         config.paths.DIST.javascript +
         '/[name]' +
         (isProduction ? '.[contenthash]' : '') +
         bundleExtension,
   },

   module: {
      rules: [sass.loaders, templatesLoader, js.loaders.babelES6],
   },

   plugins: [
      DefinePlugin(modernGlobals),
      js.plugins.ESLintWebpackPlugin(),
      sass.plugins.StylelintWebpackPlugin(),
      ProgressPlugin(isDifferentialBuild ? 'ES6' : ''),
   ].concat(
      CopyPlugin(), // it's array
      sass.plugins.MiniCssExtractPlugin, // it's array

      isCMS() ? [] : templatesPlugin(), // it's array

      isProduction
         ? [
              WebpackLicensePlugin('LICENSES'),
              js.plugins.WebpackBundleAnalyzer('bundle-analyser.html'),
           ]
         : [],
   ),

   optimization: {
      minimizer: [
         js.plugins.TerserWebpackPlugin(),
         sass.plugins.CssMinimizerPlugin(),
      ],
   },

   stats: {
      // Enable sass @debug output
      loggingDebug: config.debug && ['sass-loader'],
   },

   devServer: devServer,
};

module.exports = merge(common, modern);
