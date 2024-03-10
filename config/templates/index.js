const path = require('path');
const glob = require('glob');
const nunjucksConfig = require('./nunucks');
const dsl = require('./html-webpack-plugin-dsl');
const { config } = require('../../utils/get-config');
const { filetypesArr2regex } = require('../../utils/js');
const { filetypes } = require('../../utils/get-filetypes');
const { HtmlWebpackPlugin } = require('./html-webpack-plugin');
const {
   isCMS,
   differentialBuildConfig,
   isProduction,
} = require('../../utils/abstraction');

let templatesLoader;
const isDifferentialBuild = differentialBuildConfig();

// Templates file extensions
const extensions =
   filetypes.templates.length > 1
      ? // if more than one extension in the array
        '{' + filetypes.templates.join() + '}'
      : filetypes.templates[0];

// Prepare path for `glob`.
const dir = config.paths.SRC.path;

// Get template files.
const templates = glob.sync(dir + '/**/*' + extensions, {
   // Ignores partials (and folders when `dir + '/**/*.' + extensions`)
   ignore: ['**/_*/**', '**/.*/**', '**/_*'],
});

// Using a loader, only if not working with a CMS.
if (!isCMS()) {
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
   // No loader with a CMS and when there are no templates in `src`.
   templatesLoader = {};
}

exports.templatesLoader = templatesLoader;

exports.templatesPlugin = () => {
   // Array of html-webpack-plugin instances for each file.
   let pluginInstances;

   // There are templates in the `src` dir:
   if (templates.length) {
      // Creates an array of html-webpack-plugins for each found file.
      pluginInstances = templates.map(file => {
         // Gets file's path relative to the input 'dir', to pass it to
         // html-webpack-plugin, to output it to the same folder in the dist.
         let output = path.relative(dir, file);

         // Change extension.
         output = path.parse(output).name + '.html';

         // Passes a template (and optionally its output path) to html-webpack-plugin.
         return HtmlWebpackPlugin(file, output);
      });
   } else {
      // There are NO templates in the `src` dir:
      pluginInstances = [HtmlWebpackPlugin()];
   }

   return pluginInstances.concat(
      isDifferentialBuild && !isCMS() && !isProduction
         ? [
              // Loads differential serving script.
              // It is automatically turned of in production or with a CMS.
              new dsl(),
           ]
         : [],
   );
};

// console.log(this.templatesPlugin());
