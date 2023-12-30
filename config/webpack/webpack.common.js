// Common webpack configuration that is used in all other configs.

const { svg } = require('../svg');
const images = require('../images');
const { config } = require('../../utils/get-config');
const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');
const { isProduction } = require('../../utils/abstraction');
const {
   AssetsPlugin,
   BannerPlugin,
   ProvidePlugin,
   HashedModuleIdsPlugin,
} = require('../../utils/webpack');

module.exports = {
   // The base directory, an absolute path, for resolving entry points and loaders from the configuration.
   // By default, the current working directory of Node.js is used, but it's recommended to pass a value
   // in your configuration. This makes your configuration independent from CWD (current working directory).
   context: config.paths.ROOT,

   node: {
      __dirname: true,
      __filename: true,
   },

   mode: process.env.NODE_ENV,

   entry: config.javascript.entry,

   output: {
      path: config.paths.DIST.path,

      // Access assets in a browser on this location.
      // E.g: <domain>/<config.output.publicPath>/bundle.js.
      // Included script.src in html must match the publicPath.
      // Paths in CSS (images, fonts...) will be re-written to publicPath.
      publicPath: config.paths.PUBLIC,
   },

   // Source maps only in `development`
   devtool: isProduction ? false : 'inline-source-map',

   resolve: {
      roots: config.paths.RESOLVE_ROOTS,
      extensions: filetypes.javascript
         .concat(filetypes.sass)
         .map(ext => '.' + ext),
   },

   module: {
      rules: [
         {
            test: filetypesArr2regex(filetypes.images),
            type: 'asset/resource',
            generator: {
               // DON'T PUT A DOT BETWEEN `[hash]` AND `[ext]`
               filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
               outputPath: config.paths.DIST.images,
               publicPath: config.paths.DIST.images + '/',
            },
         },

         {
            test: filetypesArr2regex(filetypes.fonts),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
               outputPath: config.paths.DIST.fonts,
               publicPath: config.paths.DIST.fonts + '/',
            },
         },

         {
            test: filetypesArr2regex(filetypes.video),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
               outputPath: config.paths.DIST.video,
               publicPath: config.paths.DIST.video + '/',
            },
         },

         {
            test: filetypesArr2regex(filetypes.audio),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
               outputPath: config.paths.DIST.audio,
               publicPath: config.paths.DIST.audio + '/',
            },
         },

         {
            test: filetypesArr2regex(filetypes.documents),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
               outputPath: config.paths.DIST.documents,
               publicPath: config.paths.DIST.documents + '/',
            },
         },

         {
            // Not svg icons.
            test: filetypesArr2regex(filetypes.icons),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
               outputPath: config.paths.DIST.icons,
               publicPath: config.paths.DIST.icons + '/',
            },
         },
      ].concat(svg.loaders),
   },

   plugins: [
      AssetsPlugin(),
      svg.SpritePlugin(),
      ProvidePlugin(config.javascript.providePlugin),
   ].concat(
      isProduction
         ? [
              images.plugin,
              HashedModuleIdsPlugin(),
              BannerPlugin('Please find licenses at LICENSES.txt'), // Configure terser to keep this
           ]
         : [],
   ),

   optimization: {
      minimize: isProduction,

      // Tells webpack to recognise the sideEffects flag in package.json or rules to skip
      // over modules which are flagged to contain no side effects when exports are not used.
      // sideEffects: true,

      // Tells webpack to detect and remove chunks which are empty.
      removeEmptyChunks: true,

      // splitChunks: {}, // configured below

      // Setting optimization.runtimeChunk:
      // - true or 'multiple' adds an additional chunk containing only the
      //   runtime to each entrypoint.
      // - The value 'single' instead creates a runtime file to be shared
      //   for all generated chunks.
      // Warning:
      // Imported modules are initialized for each runtime chunk separately,
      // so if you include multiple entry points on a page, beware of this behavior.
      // You will probably want to set it to 'single' or use another configuration
      // that allows you to only have one runtime instance.
      runtimeChunk: config.javascript.singleRuntimeChunk ? 'single' : false,

      splitChunks: {
         chunks: 'all',
      },
   },

   stats: {
      // Child compilation stats/errors
      children: config.debug,
   },
};
