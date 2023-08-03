const { resolve, join } = require('path');
const { readFileSync, writeFile } = require('fs');
const { consoleMsg } = require('../../utils/abstraction');
const { userConfigFilename } = require('../config.abstraction');

module.exports = () => {
   const outputFile = resolve(process.cwd(), userConfigFilename);
   const defaultConfig = join(__dirname, '..', 'config.defaults.js');
   let configFileContent = readFileSync(defaultConfig, 'utf-8');

   configFileContent = configFileContent.replace(/\n\s*?\/\/.*?$/gm, '');

   writeFile(outputFile, configFileContent, err => {
      if (err) consoleMsg.severe(err);
   });
};
