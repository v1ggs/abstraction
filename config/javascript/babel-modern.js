// BABEL LOADER - MODERN BUNDLE CONFIG

const path = require('path');
const { paths } = require('../webpack/paths');
const { config } = require('../../utils/get-config');
const { filetypes } = require('../webpack/filetypes');
const { filetypesArr2regex } = require('../../utils/js');
const {
   consoleMsg,
   usingBabelrc,
   corejsVersion,
   usingBrowserslistrc,
} = require('../../utils/abstraction');
const babelCache = path.join(paths.BABELCACHE, 'es6');
let useBuiltIns;

const corejsVer = corejsVersion();
const useBrowserslistrc = usingBrowserslistrc();
const useBabelrc = usingBabelrc();

if (!corejsVer)
   consoleMsg.warning(
      'Core-js not found. Babel will not be able to add polyfills.',
   );

if (process.env.ABSTRACTION_POLYFILLS) {
   useBuiltIns = 'usage';
} else {
   useBuiltIns =
      // Adds specific imports for polyfills when they are used in each file.
      // We take advantage of the fact that a bundler will load the same polyfill only once.
      (config.javascript.polyfill === 'auto' && 'usage') ||
      // This option enables a new plugin that replaces the import "core-js/stable";
      // and require("core-js"); statements with individual imports to different
      // core-js entry points based on environment.
      (config.javascript.polyfill === 'manual' && 'entry') ||
      // Disabled.
      false;
}

exports.babelPresetEnv = [
   '@babel/preset-env',

   {
      // ignoreBrowserslistConfig: !useBrowserslistrc,

      // Setting this to false will preserve ES modules. Use this only if you
      // intend to ship native ES Modules to browsers. If you are using a
      // bundler with Babel, the default modules: "auto" is always preferred.
      modules: false,
      loose: true,
      bugfixes: true,
      debug: config.debug,
      useBuiltIns,
      corejs:
         corejsVer ||
         config.javascript.polyfill ||
         process.env.ABSTRACTION_POLYFILLS
            ? corejsVer
            : undefined,
   },
];

exports.babelLoaderES6 = {
   test: filetypesArr2regex(filetypes.javascript),

   // Exclude everything, except the source, style-loader and babel common helpers.
   // (https://github.com/babel/babel/discussions/12605)
   include: [/\bsrc\b/, /node_modules[\\/]@babel[\\/]runtime/, /style-loader/],

   // exclude: /node_modules/, // config.javascript.babel.doNotTranspile, // [/\bvendor\b/, /\blib\b/].concat(),

   use: {
      loader: 'babel-loader',
   },
};

if (!useBabelrc) {
   // https://babeljs.io/docs/en/options
   this.babelLoaderES6.use.options = {
      babelrc: false,
      configFile: false,
      browserslistConfigFile: useBrowserslistrc,
      cacheDirectory: babelCache,
      cacheCompression: false,

      presets: [this.babelPresetEnv],

      plugins: [
         // https://github.com/babel/babel/discussions/12605
         //
         // https://babeljs.io/docs/en/babel-plugin-transform-runtime
         // Babel uses very small helpers for common functions such as _extend.
         // By default, this will be added to every file that requires it.
         // You can instead require the Babel runtime as a separate module to
         // avoid the duplication.
         // @babel/plugin-transform-runtime disables automatic per-file runtime
         // injection in Babel, requiring @babel/plugin-transform-runtime instead
         // and making all helper references use it.
         //
         // ************************************************************
         // *************** THERE IS A PROBLEM WITH THIS IN LEGACY BUILD
         // *************** IT ALSO CONFLICTS WITH webpack.ProvidePlugin
         // ************************************************************
         // '@babel/plugin-transform-runtime', // removed for now
      ],
   };

   if (!useBrowserslistrc) {
      // When no targets are specified: Babel will assume you are targeting
      // the oldest browsers possible. For example, @babel/preset-env will
      // transform all ES2015-ES2020 code to be ES5 compatible.
      // Because of this, Babel's behavior is different than browserslist:
      // it does not use the defaults query when there are no targets are
      // found in your Babel or browserslist config(s).
      // **********************************************************************
      // We recognize this isn’t ideal and will be revisiting this in Babel v8.
      // **********************************************************************
      this.babelLoaderES6.use.options.presets[0][1].targets = {
         esmodules: true,
      };
   }
}
