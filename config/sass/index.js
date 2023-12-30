const cssLoader = require('./css-loader');
const sassLoader = require('./sass-loader');
const postCssLoader = require('./postcss-loader');
const { filetypesArr2regex } = require('../../utils/js');
const resolveUrlLoader = require('./resolve-url-loader');
const { filetypes } = require('../../utils/get-filetypes');
const miniCssExtract = require('./mini-css-extract-plugin');
const { isServing, isProduction } = require('../../utils/abstraction');

// For development with webpack-dev-server, you can use
// style-loader, because it injects CSS into the DOM using multiple
// <style></style> and works faster.
// Do not use style-loader and mini-css-extract-plugin together.
const styleLoader =
   isServing && !isProduction
      ? // https://webpack.js.org/loaders/style-loader/
        { loader: 'style-loader', options: { injectType: 'autoStyleTag' } }
      : {
           loader: miniCssExtract.loader,
           options: {
              // Default: the publicPath in webpackOptions.output
              // Specifies a custom public path for the external
              // resources like images, files, etc inside CSS.
              // Works like output.publicPath.
              // As of v2 "auto" can be used to get relative paths in CSS.
              publicPath: 'auto',
           },
        };

exports.loaders = {
   test: filetypesArr2regex(filetypes.sass),
   use: [styleLoader, cssLoader, postCssLoader, resolveUrlLoader, sassLoader],
};

exports.plugins = {
   // MiniCssExtractPlugin can't be used with style-loader.
   // Concatenated in the main config.
   MiniCssExtractPlugin:
      isServing && !isProduction ? [] : [miniCssExtract.plugin()],
   CssMinimizerPlugin: require('./css-minimizer-webpack-plugin'),
   StylelintWebpackPlugin: require('./stylelint-webpack-plugin'),
};
