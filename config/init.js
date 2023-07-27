const { paths } = require('./webpack/paths');
const wordpress = require('../utils/wordpress');
const { isProduction } = require('./abstraction/app.config');
const configDefault = require('./abstraction/config.defaults');
const {
   merge,
   arrMergeDedupe,
   getFirstSubdirectories,
} = require('../utils/js');
const {
   isDifferentialBuild,
   assetsJsonFilename,
   getUserConfigFile,
   singleRuntimeInfo,
   isWordPress,
} = require('../utils/abstraction');

let config;
let configUser = require(getUserConfigFile());

config =
   configUser && Object.keys(configUser).length
      ? merge(configDefault, configUser)
      : configDefault;

// Reset merged entry with the user's one, if it exists.
if (
   configUser?.javascript?.entry &&
   Object.keys(configUser?.javascript?.entry).length
) {
   config.javascript.entry = configUser.javascript.entry;
}

// Reset merged unacceptable licenses with the user's,
// if they exist.
if (
   Array.isArray(configUser?.licenses?.unacceptable) &&
   configUser?.licenses?.unacceptable.length
) {
   config.licenses.unacceptable = configUser.licenses.unacceptable;
}

config.debug = !isProduction;

const globals = {
   PRODUCTION: isProduction,
   REM_SIZE: config.css.px2rem,
   DESIGN: config.css.sortMQ,
};

config.globals = isDifferentialBuild
   ? Object.assign(
        {
           // for differential-scripts-loader
           assetsJsonFile: JSON.stringify(assetsJsonFilename),
        },
        globals,
     )
   : globals;

config.includePaths = arrMergeDedupe(
   paths.SRC.absolute,
   getFirstSubdirectories(paths.SRC.absolute),
   // Resolving folders in `components` dir may cause problems
   // with some loaders when trying to import a component with
   // `components/some-component`. It's still required because
   // of purgecss, to analyse templates and js files.
   getFirstSubdirectories(paths.SRC.absolute + '/components'),
);

// Display info in console about single runtime chunk.
singleRuntimeInfo(config.javascript.entry);

// Edit 'WP_DEBUG' an 'WP_ENVIRONMENT_TYPE' in `wp-config.php`.
isWordPress && wordpress();

exports.config = config;
