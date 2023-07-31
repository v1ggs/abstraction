#!/usr/bin/env node

// https://www.npmjs.com/package/shelljs
const shell = require('shelljs');

shell.exec(
   'npx cross-env NODE_ENV=production node --no-deprecation node_modules/webpack/bin/webpack.js --config node_modules/@v1ggs/abstraction',
);
