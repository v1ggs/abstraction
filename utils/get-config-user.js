// This is being used when only user's config file is needed.

const path = require('path');
const { existsSync } = require('fs');
const { scanDirsForFile } = require('./js');

// User config filename (nodemon watches it, don't add option to rename)
const userConfigFilename = '.abstraction.config.js';

// Get user config file
module.exports = () => {
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
