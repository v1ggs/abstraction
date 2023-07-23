// https://www.npmjs.com/package/css-minimizer-webpack-plugin
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () => {
   return new CssMinimizerPlugin({
      minimizerOptions: {
         // https://cssnano.co/docs/what-are-optimisations/
         preset: [
            'default',
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
