// TODO: move this file into init | Wed 28 Jun 2023, 13:41

// This file is used to set variables to be used only in
// the app configuration, not for default/user config.

const path = require('path');

// This app name
exports.appName = 'Abstraction';

const appDirRelative = path.relative(
   process.cwd(),
   path.resolve(__dirname, '..', '..'),
);

const appDirAbsolute = path.resolve(process.cwd(), appDirRelative);

exports.appDir = {
   rootRelative: appDirRelative,
   absolute: appDirAbsolute,
};

// Wordpress theme folder name
exports.themeDirName = path.parse(process.cwd()).base;

// User config filename (change this in nodemon.json)
exports.userConfigFilename = '.' + this.appName.toLowerCase() + '.config.js';

// Local by Flywheel certificates location on Windows
exports.fwlCertPathWin = path.resolve(
   process.env.APPDATA,
   'Local',
   'run',
   'router',
   'nginx',
   'certs',
);

// Detect if the environment is 'production'
exports.isProduction = process.env.NODE_ENV === 'production';

// We are on Windows
exports.isWindows = process.platform === 'win32';

// We are on Mac
exports.isMac = /^darwin/.test(process.platform);
