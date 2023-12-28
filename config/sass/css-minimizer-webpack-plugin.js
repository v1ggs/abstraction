// https://www.npmjs.com/package/css-minimizer-webpack-plugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () => {
   return new CssMinimizerPlugin({
      minimizerOptions: {
         // https://cssnano.co/docs/what-are-optimisations/
         preset: [
            'default',
            {
               // Turn off SVGO, because there is an SVGO loader
               // as the first in the SVG loaders chain.
               svgo: false,
            },

            {
               discardComments: {
                  // removeAllButFirst: true,
                  removeAll: true,
               },
            },
         ],
      },
   });
};
