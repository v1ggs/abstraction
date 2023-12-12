// This gets full config: config.default merged with user's config.
// It is later modified, because some properties need to be overwritten
// with user's choices - because here they are merged.

const { isProduction } = require('./abstraction');
const { paths } = require('../config/webpack/paths');
const { getUserConfig } = require('./get-user-config');
const { globals } = require('../config/webpack/globals');
const configDefault = require('../config/config.defaults');
const { merge, arrMergeDedupe, getFirstSubdirectories } = require('./js');

const userConfig = getUserConfig();

const config =
   userConfig && Object.keys(userConfig).length
      ? merge(configDefault, userConfig)
      : configDefault;

config.debug = !isProduction;

// Reset merged entry with the user's one, if it exists.
if (
   userConfig?.javascript?.entry &&
   Object.keys(userConfig?.javascript?.entry).length
) {
   config.javascript.entry = userConfig.javascript.entry;
}

// Reset merged unacceptable licenses with the user's,
// if they exist.
if (
   Array.isArray(userConfig?.licenses?.unacceptable) &&
   userConfig?.licenses?.unacceptable.length
) {
   config.licenses.unacceptable = userConfig.licenses.unacceptable;
}

config.includePaths = arrMergeDedupe(
   paths.SRC.absolute,
   getFirstSubdirectories(paths.SRC.absolute),
   // Resolving folders in `components` dir may cause problems
   // with some loaders when trying to import a component with
   // `components/some-component`. It's still required because
   // of purgecss, to analyse templates and js files.
   getFirstSubdirectories(paths.SRC.absolute + '/components'),
);

config.globals = globals;

exports.config = config;
