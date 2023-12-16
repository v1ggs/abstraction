const path = require('path');
const webpack = require('webpack');
const js = require('../javascript');
const common = require('./webpack.common');
const { config } = require('../../utils/get-config');
const { filetypes } = require('../../utils/get-filetypes');
const { isProduction } = require('../../utils/abstraction');
const { filetypesArr2regex, merge } = require('../../utils/js');
const { DefinePlugin, ProgressPlugin } = require('../../utils/webpack');

// Global variables for doing things in code for this bundle only.
const legacyGlobals = merge({}, config.globals);
legacyGlobals.ENV_MAIN = false;
legacyGlobals.ENV_LEGACY = true;

// File types to remove from legacy bundle, to process js only.
let excludes = [];
Object.keys(filetypes).forEach(type => {
   if (!(type === 'javascript')) {
      excludes.push(filetypes[type]);
   }
});

excludes = filetypesArr2regex(excludes.flat());

const legacy = {
   name: 'ES5 JAVASCRIPT',

   // Defaults to 'browserslist' or to 'web' when no browserslist configuration was found.
   // It helps determinate ES-features that may be used to generate a runtime-code
   // (all the chunks and modules are wrapped by runtime code).
   // Webpack won't transpile code with a target configured.
   target: ['web', 'es5'],

   output: {
      filename:
         config.paths.DIST.javascript +
         '/[name].es5' +
         (isProduction ? '.[contenthash].js' : '.js'),
      chunkFilename:
         config.paths.DIST.javascript +
         '/[name].es5' +
         (isProduction ? '.[contenthash].js' : '.js'),

      // Prevents webpack's arrow functions in the bundle,
      // required even with target: 'es5'.
      environment: { arrowFunction: false },
   },

   module: {
      rules: [js.loaders.babelES5],
   },

   plugins: [
      DefinePlugin(legacyGlobals),
      ProgressPlugin('ES5'),

      // Replaces unwanted modules (all but js) in the bundle with an empty file.
      // IgnorePlugin is not meant for this purpose and produces errors when used.
      // `Resolve.alias` does not take regex, so this is the only solution for now.
      // Null-loader is deprecated.
      // https://webpack.js.org/plugins/normal-module-replacement-plugin/
      new webpack.NormalModuleReplacementPlugin(
         excludes,
         path.resolve(__dirname, '..', '..', 'utils', 'empty.js'),
      ),
   ].concat(
      isProduction
         ? [js.plugins.WebpackBundleAnalyzer('bundle-analyser-es5.html')]
         : [],
   ),

   optimization: {
      minimizer: [js.plugins.TerserWebpackPlugin()],
   },
};

if (isProduction) legacy.dependencies = ['MAIN'];

module.exports = merge(common, legacy);
