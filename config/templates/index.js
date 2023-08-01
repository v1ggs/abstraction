const path = require('path');
const glob = require('glob');
const { config } = require('../init');
const nunjucksConfig = require('./nunucks');
const { paths } = require('../webpack/paths');
const dsl = require('./html-webpack-plugin-dsl');
const { filetypes } = require('../webpack/filetypes');
const { isWordPress } = require('../../utils/abstraction');
const { HtmlWebpackPlugin } = require('./html-webpack-plugin');
const { filetypesArr2regex, fixPathForGlob } = require('../../utils/js');

let templatesLoader;

// Templates file extensions
const extensions =
   filetypes.templates.length > 1
      ? // if more than one extension in the array
        '{' + filetypes.templates.join() + '}'
      : filetypes.templates[0];

// Prepare path for `glob`.
const dir = fixPathForGlob(paths.SRC.absolute);

// Get template files.
const templates = glob.sync(dir + '/*.' + extensions, {
   // Ignores partials (and folders when `dir + '/**/*.' + extensions`)
   ignore: [dir + '/_*/**', dir + '/**/_*'],
});

// Using templates only if not working with WordPress
// and when there are templates in the `src` dir.
if (!isWordPress && templates.length) {
   templatesLoader =
      // Use custom (user's) templates loader(s)
      config.templates?.customLoader?.fileTypes?.length &&
      config.templates?.customLoader?.use?.length
         ? {
              test: filetypesArr2regex(config.templates.customLoader.fileTypes),
              use: config.templates.customLoader.use,
           }
         : // Use the default (nunjucks) loader
           nunjucksConfig.loader;
} else {
   // No loader with WordPress, or if there are no templates in `src`.
   templatesLoader = {};
}

exports.templatesLoader = templatesLoader;

exports.templatesPlugin = () => {
   // There are templates in the `src` dir:
   if (templates.length) {
      // Creates an array of html-webpack-plugins for each found file.
      let templateFiles = templates.map(file => {
         // Gets file's path relative to the input 'dir', to pass it to
         // html-webpack-plugin, to output it to the same folder in the dist.
         let output = path.relative(dir, file);

         // Passes a template (and optionally its output path) to html-webpack-plugin.
         return HtmlWebpackPlugin(file, output);
      });

      // array of html-webpack-plugin instances for each file
      return templateFiles.concat([
         // Loads differential serving script.
         // It is automatically turned of in production or with WordPress.
         new dsl(),
      ]);
   } else {
      // There are NO templates in the `src` dir:
      return [HtmlWebpackPlugin()].concat([
         // Loads differential serving script.
         // It is automatically turned of in production or with WordPress.
         new dsl(),
      ]);
   }
};
