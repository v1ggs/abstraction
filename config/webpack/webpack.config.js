// WEBPACK CONFIG FILE

const { paths } = require('./paths');
const config = [require('./webpack.main')];
const { mdSync, rdSync } = require('../../utils/fs');
const {
   singleRuntimeInfo,
   differentialBuildConfig,
} = require('../../utils/abstraction');

const isDifferentialBuild = differentialBuildConfig();

if (isDifferentialBuild) {
   const legacyConfig = require('./webpack.legacy');
   config.push(legacyConfig);
}

// Display info in console about single runtime chunk.
singleRuntimeInfo(config[0].entry);

// Deletes logs and creates a new folder.
rdSync(paths.LOGS);
mdSync(paths.LOGS);

module.exports = config;
