// This configuration will produce *.js files with all required
// polyfills, per entry and per bundle.

const path = require('path');
const webpack = require('webpack');
const { paths } = require('./paths');
const { config } = require('../../utils/get-config');
const { filetypes } = require('./filetypes');
const { loaders } = require('../javascript/index');
const { rdSync, mdSync } = require('../../utils/fs');
const { filetypesArr2regex } = require('../../utils/js');
const { Notifier, exportPolyfills } = require('../../utils/webpack');
const {
   consoleMsg,
   clearScreen,
   differentialBuildConfig,
} = require('../../utils/abstraction');

const isDifferentialBuild = differentialBuildConfig();

// From: https://medium.com/finnovate-io/make-webpack-exit-on-compilation-errors-16d2eec03391
const exitPlugin = function () {
   this.hooks.done.tap('done', function (stats, callback) {
      if (!stats.compilation.errors.length) {
         clearScreen();

         consoleMsg.succes(
            '\nPlease find JavaScript files with all required `core-js` polyfills, for all entries and chunks in: \n"' +
               paths.POLYFILLS +
               '".\n\n' +
               'Now you can conditionally import them in your bundle, with `javasctipt.polyfills: manual` in the main config.\n\n' +
               'NOTE:\n' +
               "Some polyfills may be duplified, it's up to Babel, but Webpack will not bundle them more than once.\n\n",
         );

         process.exit(0);
      } else {
         clearScreen();

         throw new Error(
            stats.compilation.errors.map(err => err.message || err),
         );
      }

      callback();
   });
};

// This is where the files are built, because we don't need them,
// we need only files with extracted polyfills, and they go to `src`.
const OUTPUTDIR = path.join(paths.BABELCACHE, 'polyfills-temp');
const ENTRY = config.javascript.entry;
const CONFIG = [];

// File types to remove from the bundle
let excludes = [];

// remove all, we only need 'javascript'
Object.keys(filetypes).forEach(type => {
   if (!(type === 'javascript')) {
      excludes.push(filetypes[type]);
   }
});

excludes = filetypesArr2regex(excludes.flat());

const main = (entry, name) => {
   name = isDifferentialBuild ? name + '-[es6]' : name;

   return {
      context: paths.ROOT,
      mode: 'production',
      entry: entry,
      name: name,

      output: {
         clean: true,
         path: OUTPUTDIR,
      },

      module: {
         rules: [exportPolyfills(name), loaders.babelES6],
      },

      plugins: [
         // Replaces unwanted modules in the bundle with an empty file.
         // IgnorePlugin is not meant for this purpose and produces errors when used.
         // `Resolve.alias` does not take regex, so this is the only solution for now.
         // Null-loader is deprecated.
         // https://webpack.js.org/plugins/normal-module-replacement-plugin/
         new webpack.NormalModuleReplacementPlugin(
            excludes,
            path.resolve(
               paths.ABSTRACTIONDIR.absolute,
               'config',
               'webpack',
               'empty.js',
            ),
         ),

         Notifier(),
         // let it exit from `legacy` bundle, if `isDifferentialBuild`.
      ].concat(isDifferentialBuild ? [] : [exitPlugin]),
   };
};

const legacy = (entry, name) => {
   name = name + '-[es5]';

   return {
      context: paths.ROOT,
      mode: 'production',
      entry: entry,
      name: name,

      output: {
         clean: true,
         path: OUTPUTDIR,
      },

      module: {
         rules: [exportPolyfills(name), loaders.babelES5],
      },

      plugins: [
         exitPlugin,

         // Replaces unwanted modules in the bundle with an empty file.
         // IgnorePlugin is not meant for this purpose and produces errors when used.
         // `Resolve.alias` does not take regex, so this is the only solution for now.
         // Null-loader is deprecated.
         // https://webpack.js.org/plugins/normal-module-replacement-plugin/
         new webpack.NormalModuleReplacementPlugin(
            excludes,
            path.resolve(
               paths.ABSTRACTIONDIR.absolute,
               'config',
               'webpack',
               'empty.js',
            ),
         ),

         Notifier(),
      ],
   };
};

const addToConfig = (entry, filename) => {
   CONFIG.push(main(entry, filename));
   isDifferentialBuild && CONFIG.push(legacy(entry, filename));
};

rdSync(paths.POLYFILLS);
mdSync(paths.POLYFILLS);
// using output.clean for built files

clearScreen();

consoleMsg.info(
   '\nCreating JavaScript files with required `core-js` polyfills, based on your code and targeted browsers.',
);
console.log('');

module.exports = () => {
   if ((Array.isArray(ENTRY) && ENTRY.length) || typeof ENTRY === 'string') {
      addToConfig(ENTRY, 'index');
   } else if (typeof ENTRY === 'object') {
      Object.keys(ENTRY).forEach(entry => {
         addToConfig(ENTRY[entry], entry);
      });

      // Creates polyfills for the whole entry, if it's an object.
      addToConfig(ENTRY, 'bundle');
   }

   return CONFIG;
};
