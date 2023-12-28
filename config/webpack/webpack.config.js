// WEBPACK CONFIG FILE

const webapckConfig = [require('./webpack.main')];
const { config } = require('../../utils/get-config');
const { mdSync, rdSync } = require('../../utils/fs');
const { differentialBuildConfig } = require('../../utils/abstraction');

const isDifferentialBuild = differentialBuildConfig();

if (isDifferentialBuild) {
   const legacyConfig = require('./webpack.legacy');
   webapckConfig.push(legacyConfig);
}

// Deletes logs and creates a new folder.
rdSync(config.paths.LOGS);
mdSync(config.paths.LOGS);

module.exports = webapckConfig;
