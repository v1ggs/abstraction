const { config } = require('../../utils/get-config');
const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');
const { isProduction } = require('../../utils/abstraction');

const svgHtmlLoader = {
   test: filetypesArr2regex(filetypes.svg),
   issuer: filetypesArr2regex(filetypes.templates),
   type: 'asset/resource',
   // type: 'javascript/auto',
   generator: {
      // DON'T PUT A DOT BEFORE `[ext]`
      filename: isProduction ? '[name].[hash][ext]' : '[name][ext]',
      outputPath: config.paths.DIST.svg,
      publicPath: config.paths.DIST.svg + '/',
   },
};

const inlineSvgInHtml = {
   test: filetypesArr2regex(filetypes.svg),
   issuer: filetypesArr2regex(filetypes.templates),
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

module.exports = config.svg.extractFrom.includes('html')
   ? svgHtmlLoader
   : inlineSvgInHtml;
