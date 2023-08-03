const sass = require('../sass');
const js = require('../javascript');
const common = require('./webpack.common');
const { merge } = require('../../utils/js');
const { paths } = require('../webpack/paths');
const { config } = require('../../utils/get-config');
const { devServer, browserSync } = require('../server');
const { templatesLoader, templatesPlugin } = require('../templates');
const {
   isWP,
   isProduction,
   differentialBuildConfig,
} = require('../../utils/abstraction');
const {
   CopyPlugin,
   DefinePlugin,
   BannerPlugin,
   ProgressPlugin,
   WebpackLicensePlugin,
} = require('../../utils/webpack');

const isWordPress = isWP();
const isDifferentialBuild = differentialBuildConfig();

// Global variables for doing things in code for this bundle only.
const modernGlobals = merge({}, config.globals);
modernGlobals.ENV_MAIN = true;
modernGlobals.ENV_LEGACY = false;
// for sass-loader, to provide variables in sass files.
process.env.ENV_SASS_GLOBALS = JSON.stringify(modernGlobals);
const bundleExtension = isDifferentialBuild ? '.mjs' : '.js';

const modern = {
   name: 'MAIN', // legacy depends on this (note if changing it)

   // Defaults to 'browserslist' or to 'web' when no browserslist configuration was found.
   // It helps determinate ES-features that may be used to generate a runtime-code
   // (all the chunks and modules are wrapped by runtime code).
   // Webpack won't transpile code with a target configured.
   target: isDifferentialBuild ? ['web', 'es6'] : 'browserslist',

   output: {
      // Clean dist for this bundle and in production only.
      // The `legacy` bundle will wait for this bundle to finish.
      // If run in parallel, `legacy` files get deleted.
      // This deletes the output, even in memory (in development).
      // This makes a problem with assets plugin: `.assets.json`
      // is not complete - this compilation gets deleted.
      clean: isProduction,

      filename:
         paths.DIST.javascript +
         '/[name]' +
         (isProduction ? '.[contenthash]' : '') +
         bundleExtension,
      chunkFilename:
         paths.DIST.javascript +
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

      isWordPress ? [browserSync] : templatesPlugin(), // it's already array

      isProduction
         ? [
              WebpackLicensePlugin('LICENSES'),
              sass.plugins.MiniCssExtractPlugin(),
              BannerPlugin('Please find licenses at LICENSES.txt'), // Configure terser to keep this
              js.plugins.WebpackBundleAnalyzer('bundle-analyser-es6.html'),
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
