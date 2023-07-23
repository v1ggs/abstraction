const fs = require('fs');
const path = require('path');
const { paths } = require('../config/webpack/paths');
const { isProduction } = require('../config/abstraction/app.config');

module.exports = () => {
   // https://developer.wordpress.org/reference/functions/wp_get_environment_type/
   // Possible values are ‘local’, ‘development’, ‘staging’, and ‘production’.
   // If not set, the type defaults to ‘production’.
   // If the environment value is not in the list of allowed environments,
   // the default value will be production.
   // As an additional note, when the WP_ENVIRONMENT_TYPE constant is
   // defined as development, the DEBUG mode is automatically activated.
   const wpDevelopment = isProduction ? 'production' : 'local';

   const wpDebug = !isProduction;

   const replaceStart = '// BEGIN abstraction';
   const replaceEnd = '// END abstraction';
   const replaceContent =
      `\nif ( ! defined( 'WP_DEBUG' ) ) {\n\tdefine( 'WP_DEBUG', ${wpDebug} );\n}\n\n` +
      `define( 'WP_ENVIRONMENT_TYPE', '${wpDevelopment}' );\n`;

   const writeContent = replaceStart + replaceContent + replaceEnd;

   // Can't find a regex to have a capturing group for the content
   // between tags, so I'm using this one to match and replace all.
   const abstractionTags =
      /\/\/\s?BEGIN abstraction([\s\S])*?\/\/\s?END abstraction/g;

   // Removes `WP_ENVIRONMENT_TYPE`, if found, because we'll add it
   // between 'BEGIN/END' tags.
   const remEnvType = /define\(\s*?['"]WP_ENVIRONMENT_TYPE['"],.*?\);\n/g;

   const wpConfigFile = path.resolve(paths.ROOT, '../../../wp-config.php');
   const wpConfigFileContent = fs.readFileSync(wpConfigFile, 'utf-8');

   if (fs.existsSync(wpConfigFile)) {
      fs.writeFileSync(
         wpConfigFile,
         wpConfigFileContent
            .replace(remEnvType, '')
            .replace(abstractionTags, writeContent),
      );
   }
};
