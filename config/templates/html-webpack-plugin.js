const path = require('path');
const { config } = require('../../utils/get-config');
const {
   isWP,
   themeDirName,
   differentialBuildConfig,
} = require('../../utils/abstraction');

const isDifferentialBuild = differentialBuildConfig();
const isWordPress = isWP();

// https://www.npmjs.com/package/html-webpack-plugin
exports.DefaultHtmlWebpackPlugin = require('html-webpack-plugin');

exports.HtmlWebpackPlugin = (templateFile, outputFile) => {
   const options = {
      templateParameters: config.globals,

      // The title to use for the generated HTML document
      title: templateFile
         ? path.parse(templateFile).name.toLowerCase()
         : themeDirName,

      // true || 'head' || 'body' || false
      // Inject all assets into the given template or templateContent.
      // When passing 'body' all javascript resources will be placed at the bottom of the body element.
      // 'head' will place the scripts in the head element.
      // Passing true will add it to the head/body depending on the scriptLoading option.
      // Passing false will disable automatic injections.
      // see https://github.com/jantimon/html-webpack-plugin/tree/master/examples/custom-insertion-position
      // ****************************************************************
      inject: !isWordPress && !isDifferentialBuild,

      // Errors details will be written into the HTML page
      showErrors: true,

      // Can be used instead of template to provide an inline template.
      // templateContent: source,

      minify: false, // !isProduction,
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
