const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const getUserConfig = require('./get-config-user');

// Detect if the environment is 'production'
exports.isProduction = process.env.NODE_ENV === 'production';

// If files are in memory, not written to disk
exports.isServing = process.env.ABSTRACTION_SERVE;

// We are on Windows
exports.isWindows = process.platform === 'win32';

// We are on Mac
exports.isMac = /^darwin/.test(process.platform);

// Are we using .browserslistrc?
exports.usingBrowserslistrc = () =>
   fs.existsSync(path.join(process.cwd(), '.browserslistrc'));

// Are we using .babelrc?
exports.usingBabelrc = () =>
   fs.existsSync(path.join(process.cwd(), '.babelrc'));

// Are we building with differential serving?
exports.differentialBuildConfig = () =>
   !this.usingBrowserslistrc() && !this.usingBabelrc();

// Are we developing with a CMS?
exports.isCMS = () => {
   const userConfig = getUserConfig();
   return userConfig?.server?.backend ? true : false;
};

// Clear screen
// https://stackoverflow.com/a/26373971/14004712
// https://stackoverflow.com/questions/70250647/how-do-i-find-the-utf-8-version-of-the-octal-033c
exports.clearScreen = () => process.stdout.write('\x1bc'); // was: '\033c'

// Prints console success, info, warning and error.
class consoleMsg {
   constructor() {
      const name = '[abstraction] ';

      // For colors reference see:
      // https://stackoverflow.com/a/41407246/14004712
      const color = {
         info: '\x1b[32m%s\x1b[0m', // green
         success: '\x1b[36m%s\x1b[0m', // cyan
         warn: '\x1b[33m%s\x1b[0m', //yellow
         error: '\x1b[31m%s\x1b[0m', //red
      };

      this.succes = message => console.log(color.success, name + message);
      this.info = message => console.info(color.info, name + message);
      this.warning = message => console.warn(color.warn, name + message);
      this.error = message => {
         console.error(color.error, name + message);
      };
      this.severe = message => {
         console.error(color.error, name + message);
         process.exit();
      };
   }
}

exports.consoleMsg = new consoleMsg();

exports.singleRuntimeInfo = entryConfig => {
   if (entryConfig && Object.keys(entryConfig).length > 1) {
      this.consoleMsg.warning(
         '\nIf you include multiple entry points on a page, ' +
            'please set `javascript.singleRuntimeChunk: true`.' +
            '\nRead more at: ' +
            'https://bundlers.tooling.report/code-splitting/multi-entry/#webpack',
      );
   }
};

// Babel: It is recommended to specify the minor (core-js) version, otherwise "3" will
// be interpreted as "3.0" which may not include polyfills for the latest features.
exports.corejsVersion = () => {
   // Read core-js version to always use the lates version, when updated.
   // Replace all that is not a number or a dot (remove "^" character).
   // *************************************************************************
   // https://github.com/zloirock/core-js#babelpreset-env
   // Warning! Recommended to specify used minor core-js version, like corejs:
   // '3.31', instead of corejs: 3, since with corejs: 3 will not be injected
   // modules which were added in minor core-js releases.
   // *************************************************************************
   let corejsVersion = 3;

   try {
      corejsVersion = require('core-js/package.json').version;
      corejsVersion = corejsVersion.replace(/[^\d.]/g, '');
   } catch (err) {
      // Will not exit.
      this.consoleMsg.error(
         'Error reading "node_modules/core-js/package.json"!',
      );
   }

   // Counts dots to be able to slice() and use the main and the minor version only.
   return corejsVersion.match(/\./g).length > 1
      ? corejsVersion.slice(0, corejsVersion.lastIndexOf('.'))
      : corejsVersion;
};

exports.projectInfo = () => {
   let pkg = path.join(process.cwd(), 'package.json');
   let pkgName, pkgVersion;

   try {
      pkg = require(pkg);
      pkgName = pkg.name;
      pkgVersion = pkg.version;
   } catch (err) {
      // Will not exit.
      this.consoleMsg.error('Error reading package.json!');
   }

   return { pkgName, pkgVersion };
};

exports.phpVer = () => {
   try {
      // https://stackoverflow.com/a/34541666
      exec('php -r "echo phpversion();"', (err, stdout /*, stderr */) => {
         const version = stdout
            .toString()
            .replace(/^[.\D]*((\d+\.)(\d*)).*$/g, '$1');

         this.consoleMsg.info('Php version: ' + version);
         return version;
      });
   } catch (error) {
      this.consoleMsg.severe(
         'You do not have installed PHP, or it is not in `PATH`.',
      );
      return false;
   }
};
