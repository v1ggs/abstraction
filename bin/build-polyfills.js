#!/usr/bin/env node

// https://www.npmjs.com/package/shelljs
const shell = require('shelljs');

shell.exec(
   'npx cross-env NODE_ENV=production ABSTRACTION_POLYFILLS=true webpack --config node_modules/@v1ggs/abstraction/config/webpack/webpack.polyfills.js',
);
