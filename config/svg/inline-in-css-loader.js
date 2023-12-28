const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');

module.exports = {
   test: /\.svg$/i,

   issuer: filetypesArr2regex(filetypes.sass),

   type: 'asset/inline',

   generator: {
      dataUrl: content =>
         'data:image/svg+xml;charset=utf-8,' +
         encodeURIComponent(content.toString())
            // Reapply svgo optimisation:
            // Svgo in 'css-minimizer-webpack-plugin' is turned off,
            // because there is SVGO as the first SVG loader.
            .replaceAll('%20', ' ')
            .replaceAll('%22', "'")
            .replaceAll('%2F', '/')
            .replaceAll('%3A', ':')
            .replaceAll('%3D', '='),
   },
};
