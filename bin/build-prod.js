#!/usr/bin/env node

const path = require('path');
const { exec } = require('child_process');
const { webpackConfigPath } = require('./_fn');
const config = path.join(webpackConfigPath, 'webpack.config.js');

exec(
   `npx cross-env NODE_ENV=production node --no-deprecation node_modules/webpack/bin/webpack.js --config ${config}`,
   (error, stdout, stderr) => {
      if (error) {
         console.error(`exec error: ${error}`);
         return;
      }
      console.log(stdout);
      console.error(stderr);
   },
);
