// const { paths } = require('../../webpack/paths');
const svgo = require('./svgo-loader');

module.exports = {
   test: /\.svg$/i,

   // resourceQuery: /^[^.\s]/, // prevents processing files with 'inline' query

   use: [
      {
         loader: 'svg-sprite-loader',

         options: {
            // In the extract mode loader should be configured with plugin,
            // otherwise an error is thrown.
            // For some reason the plugin does not work for now.
            extract: false,
            // spriteFilename: paths.DIST.images + '/sprite-[hash:10].svg',
         },
      },

      svgo,
   ],
};
