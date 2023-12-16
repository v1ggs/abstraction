// Merge config.defaults with user config.
// User config completely overwrites some properties.

const { merge } = require('./js');
const { globals } = require('./get-globals');
const { isProduction } = require('./abstraction');
const { getUserConfig } = require('./get-config-user');
const configDefault = require('../config/config.defaults');
const userConfig = getUserConfig();

const config =
   userConfig && Object.keys(userConfig).length
      ? merge(configDefault, userConfig)
      : configDefault;

config.globals = globals;
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

exports.config = config;
