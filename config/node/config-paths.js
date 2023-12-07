/**
 * This file defines paths to the required webpack/nodemon configs.
 * It checks if Abstraction is installed and uses configs from node_modules,
 * or if it is being developed, and finds configs in the root dir.
 */

const fs = require('fs');
const path = require('path');

// Check if Abstraction is installed
const isDev = fs.existsSync(
   path.resolve(
      process.cwd(),
      'node_modules',
      '@v1ggs',
      'abstraction',
      'package.json',
   ),
)
   ? false
   : true;

exports.webpackConfigPath = isDev
   ? // When developing Abstraction
     path.join('config', 'webpack')
   : // When Abstraction is installed
     path.join('node_modules', '@v1ggs', 'abstraction', 'config', 'webpack');

exports.nodemonConfigPath = isDev
   ? // When developing Abstraction
     path.join('config', 'node', 'nodemon', 'dev')
   : // When Abstraction is installed
     path.join(
        'node_modules',
        '@v1ggs',
        'abstraction',
        'config',
        'node',
        'nodemon',
        'prod',
     );
