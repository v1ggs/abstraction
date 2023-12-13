const path = require('path');
const cssLoader = require('./css-loader');
const sassLoader = require('./sass-loader');
const postCssLoader = require('./postcss-loader');
const { filetypesArr2regex } = require('../../utils/js');
const { isServing } = require('../../utils/abstraction');
const resolveUrlLoader = require('./resolve-url-loader');
const { filetypes } = require('../../utils/get-filetypes');
const miniCssExtract = require('./mini-css-extract-plugin');

// For development with webpack-dev-server, you can use
// style-loader, because it injects CSS into the DOM using multiple
// <style></style> and works faster.
// Do not use style-loader and mini-css-extract-plugin together.
const styleLoader = isServing
   ? // https://webpack.js.org/loaders/style-loader/
     { loader: 'style-loader', options: { injectType: 'autoStyleTag' } }
   : {
        loader: miniCssExtract.loader,
        options: {
           // Default: the publicPath in webpackOptions.output
           // Specifies a custom public path for the external
           // resources like images, files, etc inside CSS.
           // Works like output.publicPath.
           publicPath: (resourcePath, context) =>
              // Relative publicPath:
              // e.g. for ./css/admin/main.css the publicPath will be ../../
              // while for ./css/main.css the publicPath will be ../
              path.relative(path.dirname(resourcePath), context) + '/',
        },
     };

exports.loaders = {
   test: filetypesArr2regex(filetypes.sass),
   use: [styleLoader, cssLoader, postCssLoader, resolveUrlLoader, sassLoader],
};

exports.plugins = {
   // MiniCssExtractPlugin can't be used with style-loader.
   // Concatenated in the main config.
   MiniCssExtractPlugin: isServing ? [] : [miniCssExtract.plugin()],
   CssMinimizerPlugin: require('./css-minimizer-webpack-plugin'),
   StylelintWebpackPlugin: require('./stylelint-webpack-plugin'),
};
