#!/usr/bin/env node

// https://www.npmjs.com/package/shelljs
const shell = require('shelljs');

shell.exec(
   'npx nodemon --config node_modules/@v1ggs/abstraction/config/node/nodemon.json',
);
