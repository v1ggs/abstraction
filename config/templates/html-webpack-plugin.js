const fs = require('fs');
const path = require('path');
const { config } = require('../init');
const { merge } = require('../../utils/js');
const { isProduction } = require('../abstraction/app.config');
const { isDifferentialBuild, isWordPress } = require('../../utils/abstraction');

// Differential serving javascripts loader
const abstractionDsl = path.resolve(
   process.cwd(),
   'node_modules',
   '@v1ggs',
   'abstraction-dsl',
   'test',
   'abstraction.dsl.min.js',
);

// https://www.npmjs.com/package/html-webpack-plugin
exports.DefaultHtmlWebpackPlugin = require('html-webpack-plugin');

exports.HtmlWebpackPlugin = (templateFile, outputFile) => {
   const options = {
      templateParameters: merge(config.globals, {
         // Plugins that work with `html-webpack-plugin` can be applied only to
         // one transpilation (`main` or `legacy`).
         // The same stands for the manipulation with `htmlWebpackPlugin.files.js`.
         // Therefore this is the only solution for now.
         // JavaScripts have to be added manually to html in production.
         diffServeLoader:
            isDifferentialBuild &&
            !isProduction &&
            !isWordPress &&
            fs.existsSync(abstractionDsl)
               ? fs.readFileSync(abstractionDsl, 'utf-8')
               : false,
      }),

      // The title to use for the generated HTML document
      title: templateFile
         ? path.parse(templateFile).name.toLowerCase()
         : // .slice(0, templateFile.lastIndexOf('.'))
           true,

      // true || 'head' || 'body' || false
      // Inject all assets into the given template or templateContent.
      // When passing 'body' all javascript resources will be placed at the bottom of the body element.
      // 'head' will place the scripts in the head element.
      // Passing true will add it to the head/body depending on the scriptLoading option.
      // Passing false will disable automatic injections.
      // see https://github.com/jantimon/html-webpack-plugin/tree/master/examples/custom-insertion-position
      // ****************************************************************
      // If developing for module/nomodule, auto-injecting scripts is disabled, and
      // `differential-scripts-loader.min.js` will be used:
      //   - If working with custom templates, `differential-scripts-loader.min.js`
      //     has to be inlined manually, using a predefined variable in a template.
      //   - If working with the default template, a custom (modified) one will be
      //     used, which will inline `differential-scripts-loader.min.js`.
      inject: !isWordPress && !isDifferentialBuild,

      // Errors details will be written into the HTML page
      showErrors: true,

      // Can be used instead of template to provide an inline template.
      // templateContent: source,

      minify: !isProduction,
   };

   if (templateFile) {
      // webpack relative or absolute path to the template.
      // By default it will use src/index.ejs if it exists.
      // https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md
      options.template = templateFile;
   }

   if (outputFile) {
      // The file to write the HTML to. Defaults to index.html.
      // You can specify a subdirectory here too (eg: assets/admin.html).
      // The [name] placeholder will be replaced with the entry name.
      // Can also be a function e.g. (entryName) => entryName + '.html'.
      // **************************************************************
      // DevServer can't serve from memory with this option set `true`.
      // **************************************************************
      options.filename = outputFile;
   }

   // console.log(options);

   return new this.DefaultHtmlWebpackPlugin(options);
};
