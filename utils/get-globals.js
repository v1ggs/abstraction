// ############################################################################
// ########################################################### GLOBAL VARIABLES
// ############################################################################
const { isProduction } = require('./abstraction');
const { getUserConfig } = require('./get-config-user');
const { assetsJsonFilename } = require('../config/config.abstraction');

const userConfig = getUserConfig();

// Default global variables for usage in the source code.
// Add these to .eslintrc, e.g. "globals": { "PRODUCTION": "readonly" }.
const globals = Object.assign(
   userConfig.globals,
   {
      // for differential-scripts-loader
      assetsJsonFile: assetsJsonFilename,
   },
   {
      PRODUCTION: isProduction,
      REM_SIZE: userConfig?.css?.px2rem || 16,
      DESIGN: userConfig?.css?.sortMQ
         ? userConfig?.css?.sortMQ
         : 'mobile-first',
   },
);

const keys = Object.keys(globals);
const values = Object.values(globals).map(value => {
   if (typeof value === 'string') {
      // Required!!
      return (value = JSON.stringify(value));
   }

   // console.log(value);
   return value;
});

for (let i = 0; i < values.length; i++) {
   globals[keys[i]] = values[i];
}

exports.globals = globals;
