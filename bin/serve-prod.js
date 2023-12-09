#!/usr/bin/env node

process.env.NODE_ENV = 'production';
process.env.ABSTRACTION_SERVE = true;

const timestamp = new Date();
const time =
   timestamp.getHours() +
   ':' +
   timestamp.getMinutes() +
   ':' +
   timestamp.getSeconds();
const nodemon = require('nodemon');
const { consoleMsg } = require('../utils/abstraction');
const nodemonConfig = {
   script: __dirname + '/server.js',
   // ext: 'mjs,js',
   ...require('./nodemon.json'),
};

// console.log(nodemonConfig);

nodemon(nodemonConfig)
   .on('start', () => {
      consoleMsg.info(`Serving in ${process.env.NODE_ENV} mode.`);
      consoleMsg.info(`Watching files: ` + nodemonConfig.watch);
      consoleMsg.info(`Time: ${time}`);
   })
   .on('quit', () => {
      consoleMsg.info('Quitting...');
      consoleMsg.info(`Time: ${time}`);
      process.exit();
   })
   .on('restart', files => {
      consoleMsg.info(`Restarted due to changes in files: ${files}`);
      consoleMsg.info(`Time: ${time}`);
   });
