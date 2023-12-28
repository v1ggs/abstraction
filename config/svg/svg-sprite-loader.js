const { config } = require('../../utils/get-config');
const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');
const { isProduction } = require('../../utils/abstraction');

const filename = isProduction
   ? 'sprite-[chunkname]-[hash].svg'
   : 'sprite-[chunkname].svg';

const spriteLoader = {
   test: /\.svg$/i,

   use: [
      {
         // https://www.npmjs.com/package/svg-sprite-loader
         loader: 'svg-sprite-loader',

         options: {
            spriteFilename: filename,
            outputPath: config.paths.DIST.svg + '/',
            // publicPath: config.paths.DIST.svg + '/',

            // `false` fixes issues with SVG in CSS.
            // https://github.com/JetBrains/svg-sprite-loader/issues/324#issuecomment-619565347
            esModule: !config.svg.extractFrom.includes('css'),
         },
      },
   ],
};

// If configured to extract SVG from JavaScript:
if (config.svg.extractFrom.includes('js')) {
   // If SVG in CSS has to be external (sprite), this has to be
   // autoconfigured (not defined in loader's config).
   // By default, autoconfigured will bundle SVG in JS, and extract from CSS.
   // If SVG has to be inlined in CSS, the loader is further configured below.
   // In the extract mode loader should be configured
   // with plugin, otherwise an error is thrown.
   spriteLoader.use[0].options.extract = true;
}

// If not configured to extract SVG in CSS:
if (!config.svg.extractFrom.includes('css')) {
   // Use this loader to process JavaScript only,
   // SVG in CSS will be inlined.
   spriteLoader.issuer = filetypesArr2regex(filetypes.javascript);
} else {
   // Fixes issues with SVG in CSS.
   // https://github.com/JetBrains/svg-sprite-loader/issues/479#issuecomment-1381405976
   spriteLoader.type = 'javascript/auto';
}

module.exports = spriteLoader;
