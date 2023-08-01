const { config } = require('../../utils/get-config');

// Since Sass implementations don't provide url rewriting, all linked assets must
// be relative to the output. Thankfully there are a two solutions to this problem:
// - Add the missing url rewriting using the resolve-url-loader. Place it before
//   sass-loader in the loader chain.
// - Library authors usually provide a variable to modify the asset path.
//   bootstrap-sass for example has an $icon-font-path.
// https://www.npmjs.com/package/sass-loader
module.exports = {
   loader: 'sass-loader',

   options: {
      // Enable source map generation (depends on the devtool option)
      sourceMap: true,

      // https://github.com/webpack-contrib/sass-loader#additionaldata
      additionalData: content => {
         let scssGlobals = '';
         const absGlobalsModern = JSON.parse(process.env.ENV_SASS_GLOBALS);
         const vars = Object.keys(absGlobalsModern);

         vars.forEach(global => {
            if (
               global !== 'webpackEntries' &&
               global !== 'assetsJsonFilename'
            ) {
               scssGlobals +=
                  '$' +
                  global.toLowerCase().replace(/_/g, '-') +
                  ': ' +
                  absGlobalsModern[global] +
                  ';\n';
            }
         });

         return scssGlobals + content;
      },

      // https://github.com/sass/dart-sass
      sassOptions: {
         // This array of strings option provides load paths for Sass to look for stylesheets.
         // Earlier load paths will take precedence over later ones.
         includePaths: config.includePaths,

         // nested | expanded | compact | compressed
         outputStyle: 'expanded',

         // 'space' | 'tab'
         indentType: 'tab',

         // max 10, default: 2
         indentWidth: 3,

         // Treats the @warn rule as a webpack warning.
         // It will be true by default in the next major release.
         warnRuleAsWarning: true,
      },
   },
};
