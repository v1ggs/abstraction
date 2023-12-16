const { config } = require('../../utils/get-config');
const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');

// simple-nunjucks-loader config
// https://www.npmjs.com/package/simple-nunjucks-loader
exports.loader = {
   test: filetypesArr2regex(filetypes.templates),

   use: [
      {
         loader: 'simple-nunjucks-loader',

         options: Object.assign(
            {
               // (default: true) controls if output with dangerous
               // characters are escaped automatically.
               autoescape: false,

               // (default: false) automatically remove trailing newlines
               // from a block/tag
               trimBlocks: true,

               // (default: false) automatically remove leading whitespace
               // from a block/tag
               lstripBlocks: true,

               tags: {
                  blockStart: '{%',
                  blockEnd: '%}',
                  variableStart: '{{',
                  variableEnd: '}}',
                  commentStart: '{#',
                  commentEnd: '#}',
               },

               // One or more paths to resolve templates paths
               searchPaths: config.paths.RESOLVE_ROOTS,

               // Paths to resolve static assets. Works like STATICFILES_DIRS
               assetsPaths: config.paths.RESOLVE_ROOTS,

               // Map global function to corresponding module
               globals: {},

               // Map extension to corresponding module
               extensions: {},

               //Map filters to corresponding module
               filters: {},
            },

            // user's config, overwrites the default
            config.templates.nunjucksOptions,
         ),
      },

      {
         // loader that replaces relative asset paths
         // with the '{% static %}' tag, for the nunjucks
         // loader to copy assets and rewrite urls
         loader: require.resolve(__dirname, 'nunjucks-preloader.js'),

         options: {
            filetypes: filetypes.images.concat(
               filetypes.icons,
               filetypes.video,
               filetypes.audio,
            ),
         },
      },
   ],
};

// console.log(this.loader);
