#!/usr/bin/env node

const { exec } = require('child_process');

exec(
   'npx cross-env IS_WP=true node node_modules/@v1ggs/abstraction/config/node/prepare.js',
   (error, stdout, stderr) => {
      if (error) {
         console.error(`exec error: ${error}`);
         return;
      }
      console.log(stdout);
      console.error(stderr);
   },
);
