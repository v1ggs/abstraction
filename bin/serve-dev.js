#!/usr/bin/env node

const path = require('path');
const { exec } = require('child_process');
const { nodemonConfigPath } = require('../config/node/config-paths');
const config = path.join(nodemonConfigPath, 'nodemon.dev.json');

exec(`npx nodemon --config ${config}`, (error, stdout, stderr) => {
   if (error) {
      console.error(`exec error: ${error}`);
      return;
   }
   console.log(stdout);
   console.error(stderr);
});
