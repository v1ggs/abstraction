// This is being used when only user's config file is needed.

const path = require('path');
const { existsSync } = require('fs');
const { scanDirsForFile } = require('./js');
const { userConfigFilename } = require('../config/config.abstraction');

// Get user config file
exports.getUserConfig = () => {
   let config = false;

   try {
      // Try to find the user config file in cwd
      let file = path.resolve(process.cwd(), userConfigFilename);

      if (existsSync(file)) {
         config = file;
      } else {
         // scan top level subdirectories to find the file
         config = scanDirsForFile(userConfigFilename);
      }
   } catch (error) {
      // console.error(error);
   }

   return config ? require(config) : config;
};
