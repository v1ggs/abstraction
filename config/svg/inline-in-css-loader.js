const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');

module.exports = {
   test: /\.svg$/i,

   issuer: filetypesArr2regex(filetypes.sass),

   type: 'asset/inline',

   generator: {
      dataUrl: content =>
         // Svgo in 'css-minimizer-webpack-plugin'
         // will turn `%20` into spaces.
         'data:image/svg+xml;charset=utf-8,' +
         encodeURIComponent(content.toString()),
   },
};
