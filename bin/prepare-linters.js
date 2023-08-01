#!/usr/bin/env node

// https://www.npmjs.com/package/shelljs
const shell = require('shelljs');

shell.exec(
   'npx cross-env node node_modules/@v1ggs/abstraction/config/node/linters.js',
);
