// This is a differential serving plugin.
// It is being used only if we're working module/nomodule way,
// and NOT in production and NOT working with WordPress.

// Plugins that work with `html-webpack-plugin` can be applied only to
// one transpilation (`main` or `legacy`).
// The same stands for the manipulation with `htmlWebpackPlugin.files.js`.
// Therefore this is the only solution for now.
// JavaScripts have to be added manually to html in production.

// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');
const { paths } = require('../../utils/get-paths');
const { existsSync, readFileSync } = require('fs');
const {
   isWP,
   isProduction,
   differentialBuildConfig,
} = require('../../utils/abstraction');

const isDifferentialBuild = differentialBuildConfig();
const isWordPress = isWP();

class AbstractionDSL {
   apply(compiler) {
      compiler.hooks.compilation.tap('AbstractionDSL', compilation => {
         // console.log('The compiler is starting a new compilation...');

         // Static Plugin interface |compilation |HOOK NAME | register listener
         HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            'AbstractionDSL', // <-- Set a meaningful name here for stacktraces

            (data, cb) => {
               if (isDifferentialBuild && !isWordPress && !isProduction) {
                  // Differential serving javascripts loader
                  const abstractionDsl = path.resolve(
                     paths.ROOT,
                     'node_modules',
                     '@v1ggs',
                     'abstraction-dsl',
                     'test',
                     'abstraction.dsl.js',
                  );

                  const content = existsSync(abstractionDsl)
                     ? readFileSync(abstractionDsl, 'utf8')
                     : '';

                  // Manipulate the content
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
