const { config } = require('../init');

// Since Sass implementations don't provide url rewriting, all linked assets must
// be relative to the output. Thankfully there are a two solutions to this problem:
// - Add the missing url rewriting using the resolve-url-loader. Place it before
//   sass-loader in the loader chain.
// - Library authors usually provide a variable to modify the asset path.
//   bootstrap-sass for example has an $icon-font-path.
// https://www.npmjs.com/package/sass-loader

// The typical use case is resolve-url-loader between sass-loader and css-loader.
// Important:
// source-maps required for loaders preceding resolve-url-loader
// (regardless of devtool).
// https://www.npmjs.com/package/resolve-url-loader
module.exports = {
   loader: 'resolve-url-loader',
   options: {
      sourceMap: true,
      debug: config.debug,
   },
};
