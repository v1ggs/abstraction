// This is a differential serving plugin.
// It is being used only if we're working module/nomodule way,
// NOT in production and NOT when working with a CMS.

// Why:
// Plugins that work with `html-webpack-plugin` can be applied only to
// one transpilation (`main` or `legacy`).
// The same stands for the manipulation with `htmlWebpackPlugin.files.js`.
// Therefore this seems to be the only solution.
// In production or with a CMS, JavaScripts have to be enqueued manually.

// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const { readFileSync } = require('fs');
const { config } = require('../../utils/get-config');
const {
   isCMS,
   isProduction,
   differentialBuildConfig,
} = require('../../utils/abstraction');

const isDifferentialBuild = differentialBuildConfig();

class AbstractionDSL {
   apply(compiler) {
      compiler.hooks.compilation.tap('AbstractionDSL', compilation => {
         // console.log('The compiler is starting a new compilation...');

         // Static Plugin interface |compilation |HOOK NAME | register listener
         HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            'AbstractionDSL', // <-- Set a meaningful name here for stacktraces

            (data, cb) => {
               if (isDifferentialBuild && !isCMS() && !isProduction) {
                  // Differential serving javascripts loader
                  const content = readFileSync(
                     path.resolve(__dirname, 'dsl-es5.min.js'),
                     'utf8',
                  ).replace(
                     `"assets-json-filename"`,
                     `${config.globals.assetsJsonFile}`,
                  );

                  // Add the script before the `</head>`.
                  data.html = data.html.replace(
                     /(<\/head>)/g,
                     `\t<script id="abstraction-differential-serving-script">` +
                        `${content}` +
                        `</script>\n` +
                        '$1',
                  );
               }

               // Tell webpack to move on
               cb(null, data);
            },
         );
      });
   }
}

module.exports = AbstractionDSL;
