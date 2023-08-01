// ############################################################################
// ########################################################### GLOBAL VARIABLES
// ############################################################################
const { isProduction } = require('../../utils/abstraction');
const { getUserConfig } = require('../../utils/get-user-config');

// Default global variables for usage in the source code.
// These can't be changed by the user.
// Add these to .eslintrc: "globals": { "PRODUCTION": "readonly" }.
exports.globals = {
   PRODUCTION: isProduction,
   REM_SIZE: getUserConfig?.css?.px2rem || 16,
   DESIGN: getUserConfig?.css?.sortMQ || 'mobile-first',
};
