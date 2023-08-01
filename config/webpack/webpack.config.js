// WEBPACK CONFIG FILE

const { paths } = require('./paths');
const config = [require('./webpack.main')];
const { mdSync, rdSync } = require('../../utils/fs');
const {
   singleRuntimeInfo,
   isDifferentialBuild,
} = require('../../utils/abstraction');

if (isDifferentialBuild) {
   const legacyConfig = require('./webpack.legacy');
   config.push(legacyConfig);
}

// Display info in console about single runtime chunk.
singleRuntimeInfo(config.entry);

// Deletes logs and creates a new folder.
rdSync(paths.LOGS);
mdSync(paths.LOGS);

module.exports = config;
