// WEBPACK CONFIG FILE

const config = [require('./webpack.main')];
const { paths } = require('./paths');
const { mdSync, rdSync } = require('../../utils/fs');
const { isDifferentialBuild } = require('../../utils/abstraction');

if (isDifferentialBuild) {
   const legacyConfig = require('./webpack.legacy');
   config.push(legacyConfig);
}

// Deletes logs and creates a new folder.
rdSync(paths.LOGS);
mdSync(paths.LOGS);

module.exports = config;
