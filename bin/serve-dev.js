#!/usr/bin/env node

process.env.NODE_ENV = 'development';
process.env.ABSTRACTION_SERVE = true;

const time = () => {
   const timestamp = new Date();

   return (
      timestamp.getHours() +
      ':' +
      timestamp.getMinutes() +
      ':' +
      timestamp.getSeconds()
   );
};

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
      consoleMsg.info(`Watching config files: ` + nodemonConfig.watch);
      consoleMsg.info(`Time: ${time()}`);
   })
   .on('quit', () => {
      consoleMsg.info('Quitting...');
      consoleMsg.info(`Time: ${time()}`);
      process.exit();
   })
   .on('restart', files => {
      consoleMsg.info(`Restarted due to changes in files: ${files}`);
   });
