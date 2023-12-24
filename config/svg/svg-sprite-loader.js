const svgo = require('./svgo-loader');
const { config } = require('../../utils/get-config');
const { isProduction } = require('../../utils/abstraction');

const filename = isProduction
   ? 'sprite-[chunkname]-[hash].svg'
   : 'sprite-[chunkname].svg';

module.exports = {
   test: /\.svg$/i,

   // Fixes issues with svg in css.
   // https://github.com/JetBrains/svg-sprite-loader/issues/479#issuecomment-1381405976
   type: 'javascript/auto',

   use: [
      {
         // https://www.npmjs.com/package/svg-sprite-loader
         loader: 'svg-sprite-loader',

         options: {
            spriteFilename: filename,
            outputPath: config.paths.DIST.svg + '/',
            publicPath: config.paths.DIST.svg + '/',

            // In the extract mode loader should be configured
            // with plugin, otherwise an error is thrown.
            // extract: true, // Don't use for now.

            // Fixes issues with svg in css.
            // https://github.com/JetBrains/svg-sprite-loader/issues/324#issuecomment-619565347
            esModule: false,
         },
      },

      svgo,
   ],
};
