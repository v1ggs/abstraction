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

const common = {
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
               filename: isProduction ? '[name].[hash][ext]' : '[name].[ext]',
               outputPath: config.paths.DIST.images,
            },
         },

         {
            test: filetypesArr2regex(filetypes.fonts),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name].[ext]',
               outputPath: config.paths.DIST.fonts,
            },
         },

         {
            test: filetypesArr2regex(filetypes.video),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name].[ext]',
               outputPath: config.paths.DIST.video,
            },
         },

         {
            test: filetypesArr2regex(filetypes.audio),
            type: 'asset/resource',
            generator: {
               filename: isProduction ? '[name].[hash][ext]' : '[name].[ext]',
               outputPath: config.paths.DIST.audio,
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
   },

   stats: {
      // Child compilation stats/errors
      children: config.debug,
   },
};

/**
 * ========================================================
 * Vendor packages settings
 * NOT USED NOW...
 * ========================================================
 *
 * @see https://webpack.js.org/plugins/split-chunks-plugin/
 */
if (
   config.javascript.vendor === true ||
   config.javascript.vendor === 'single'
) {
   // All vendors together.
   common.optimization.splitChunks = {
      name: 'vendor',
      chunks: 'all',
   };
} else if (config.javascript.vendor === 'vendor-polyfill') {
   // Separate core-js.
   common.optimization.splitChunks = {
      cacheGroups: {
         polyfills: {
            name: 'polyfills',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](core-js)[\\/]/,
         },

         vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](?!core-js)/,
         },
      },
   };
} else if (config.javascript.vendor === 'polyfill') {
   // Separate core-js.
   common.optimization.splitChunks = {
      cacheGroups: {
         polyfills: {
            name: 'polyfills',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](core-js)[\\/]/,
         },
      },
   };
} else if (config.javascript.vendor === 'split-all') {
   // All vendors separate, including core-js.
   // https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
   common.optimization.splitChunks = {
      chunks: 'all',
      minSize: 0,
      maxInitialRequests: Infinity,

      cacheGroups: {
         vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
               // get the name. E.g. node_modules/packageName/not/this/part.js
               // or node_modules/packageName
               const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
               )[1];

               // npm package names are URL-safe, but some servers don't like @ symbols
               return `npm.${packageName.replace('@', '')}`;
            },
         },
      },
   };
}

module.exports = common;
