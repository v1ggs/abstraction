// config.defaults.js

module.exports = {
   path: {
      // Source files
      src: './src',

      // Output path
      dist: './public',

      // Path to assets json file, relative to "dist".
      assetsJson: 'abstraction-assets.json',
   },

   // Defines global variables that will be available in code.
   // Default variables will be added to this object.
   globals: {
      G_DISPLAY: 'display',
      G_BLOCK: 'block',
   },

   javascript: {
      // Webpack's entry: https://webpack.js.org/concepts/entry-points/
      // Tip: As a rule of thumb: Use exactly one entry point for each HTML document.
      // See the issue described here for more details:
      // https://bundlers.tooling.report/code-splitting/multi-entry/#webpack
      entry: {
         general: './src/general/general.js',
         treeShaking: './src/treeshaking/treeshaking.js',
         dynamicImport: './src/dynamic-imports/dynamic-imports.js',
         globals: './src/globals/globals.js',
         purgecss: './src/purgecss/purgecss.js',
         images: './src/images/images.js',
      },

      // If you have multiple entry points on a page, set this `true`.
      singleRuntimeChunk: true,

      // Use babel (core-js) polyfills: 'auto' | 'manual' | false.
      polyfill: 'auto',

      // https://webpack.js.org/plugins/provide-plugin/
      // Automatically load modules instead of having to import or
      // require them everywhere.
      providePlugin: {
         // Example:
         // $: 'jquery', // in a module: $('#item'); <= works
         // jQuery: 'jquery', // in a module: jQuery('#item'); <= works
      },
   },

   css: {
      // Base size for converting pixels to rems. Set `false` to prevent
      // converting pixels to rems. It's available in scss.
      baseFontSize: 16,

      // Group and sort media queries (mobile/desktop first way).
      // Set `false` to prevent grouping and sorting media queries.
      sortMQ: 'desktop-first',

      // Removes unused selectors from css. Removed selectors can be found
      // in the `logs` folder in the project's root.
      // Set `purge: false` to prevent purging css.
      purge: {
         keepSelectors: ['user-config'],
      },
   },

   templates: {
      // simple-nunjucks-loader options
      // https://www.npmjs.com/package/simple-nunjucks-loader
      nunjucksOptions: {},

      // Use a different loader for templates
      customLoader: {
         // Test files: an array, will be converted to regex.
         fileTypes: [],

         // Array of objects with 'loader' and 'options' properties,
         // just like webpack's `module.rules` or `use: []`.
         use: [],
      },
   },

   svg: {
      extractFrom: ['css', 'js'],
      optimize: {
         removeTitle: true,
         removeDesc: true,
         removeComments: true,
         removeMetadata: false,
         cleanupIds: true,
         removeDoctype: true,
         removeViewBox: true,
      },
   },

   images: {
      // Images quality 0-100.
      quality: 80,
   },

   licenses: {
      // License file is being created automatically for JavaScript packages.
      // For sass packages, use the `include` array (the name of the package).
      // Example: `include: ['some-module'],`
      include: [],

      // Exclude unwanted licenses. Example: `exclude: ['some-module'],`
      exclude: [],

      // When using a package with one of these licenses, webpack will
      // throw an error. Completely overwritten with user's config.
      unacceptable: ['GPL', 'AGPL', 'LGPL', 'NGPL'],
   },

   server: {
      // Local backend domain, e.g. 'http://abstraction.local',
      // for development with a CMS.
      // backend: 'https://test-backend.local',

      // https://webpack.js.org/configuration/dev-server/
      // Complete devServer config, merged with the default.
      devServer: {},
   },
};
