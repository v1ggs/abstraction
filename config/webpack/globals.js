// ############################################################################
// ########################################################### GLOBAL VARIABLES
// ############################################################################
const { isProduction } = require('../abstraction/app.config');

// Default global variables for usage in the source code.
// These can't be changed by the user.
// Add these to .eslintrc: "globals": { "PRODUCTION": "readonly" }.
exports.globals = {
   PRODUCTION: isProduction,
   REM_SIZE: 16, // overriden in init
   DESIGN: 'mobile-first', // overriden in init
};
