const path = require('path');
const glob = require('glob');
const { config } = require('../init');
const nunjucksConfig = require('./nunucks');
const { paths } = require('../webpack/paths');
const { filetypes } = require('../webpack/filetypes');
const { isProduction } = require('../abstraction/app.config');
const { filetypesArr2regex, fixPathForGlob } = require('../../utils/js');
const { isDifferentialBuild, isWordPress } = require('../../utils/abstraction');
const {
   HtmlWebpackPlugin,
   DefaultHtmlWebpackPlugin,
} = require('./html-webpack-plugin');

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
      let templateFiles = templates.map((file) => {
         // Gets file's path relative to the input 'dir', to pass it to
         // html-webpack-plugin, to output it to the same folder in the dist.
         let output = path.relative(dir, file);

         // Passes a template (and optionally its output path) to html-webpack-plugin.
         return HtmlWebpackPlugin(file, isProduction ? output : false);
      });

      // array of html-webpack-plugin instances for each file
      return templateFiles;
   } else {
      // There are NO templates in the `src` dir:
      if (!isDifferentialBuild) {
         // Original template
         return [new DefaultHtmlWebpackPlugin()];
      } else {
         // Modified template
         return [HtmlWebpackPlugin('./ds-tpl.ejs')];
      }
   }
};
