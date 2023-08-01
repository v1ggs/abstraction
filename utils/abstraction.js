const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const exec = require('child_process').exec;
const { paths } = require('../config/webpack/paths');
const { getUserConfig } = require('./get-user-config');
const { appName } = require('../config/config.abstraction');

// Wordpress theme folder name
exports.themeDirName = path.parse(process.cwd()).base;

// Detect if the environment is 'production'
exports.isProduction = process.env.NODE_ENV === 'production';

// If files are in memory, not written to disk
exports.isServing = process.env.ABSTRACTION_SERVE;

// We are on Windows
exports.isWindows = process.platform === 'win32';

// We are on Mac
exports.isMac = /^darwin/.test(process.platform);

// Are we using .browserslistrc?
exports.usingBrowserslistrc = (() =>
   fs.existsSync(path.join(process.cwd(), '.browserslistrc')))();

// Are we using .babelrc?
exports.usingBabelrc = (() =>
   fs.existsSync(path.join(process.cwd(), '.babelrc')))();

// Are we building with differential serving?
exports.isDifferentialBuild = (() =>
   !this.usingBrowserslistrc && !this.usingBabelrc)();

// Are we developing with WordPress?
exports.isWordPress = (() => {
   const configExists = getUserConfig();

   if (configExists) {
      const userConfig = configExists;
      return userConfig.server?.proxy ? true : false;
   }

   return false;
})();

// Clear screen
// https://stackoverflow.com/a/26373971/14004712
// https://stackoverflow.com/questions/70250647/how-do-i-find-the-utf-8-version-of-the-octal-033c
exports.clearScreen = () => process.stdout.write('\x1bc'); // was: '\033c'

// Prints console success, info, warning and error.
class consoleMsg {
   constructor() {
      // For colors reference see:
      // https://stackoverflow.com/a/41407246/14004712
      const color = {
         info: '\x1b[36m%s\x1b[0m', // cyan
         success: '\x1b[32m%s\x1b[0m', // green
         warn: '\x1b[33m%s\x1b[0m', //yellow
         error: '\x1b[31m%s\x1b[0m', //red
      };

      const name = `[${appName.toLowerCase()}]: `;

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
      this.clearScreen();
      this.consoleMsg.warning(
         '\nIf you include multiple entry points on a page, ' +
            'please set `config.javascript.singleRuntimeChunk: true`.' +
            '\nRead more at: ' +
            'https://bundlers.tooling.report/code-splitting/multi-entry/#webpack',
      );
   }
};

// Babel: It is recommended to specify the minor (core-js) version, otherwise "3" will
// be interpreted as "3.0" which may not include polyfills for the latest features.
exports.corejsVersion = (() => {
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
      // console.log();
   }

   // Counts dots to be able to slice() and use the main and the minor version only.
   return corejsVersion.match(/\./g).length > 1
      ? corejsVersion.slice(0, corejsVersion.lastIndexOf('.'))
      : corejsVersion;
})();

// If we're on SSL, what domain and certificate to use.
exports.useSsl = (() => {
   const configExists = getUserConfig();
   const appConsoleLog = this.consoleMsg;
   let userConfig;

   if (configExists) userConfig = configExists;

   // We need a domain that is being blocked with hosts file,
   // not the theme dir name.
   const domain = userConfig?.server?.proxy
      ? userConfig.server.proxy
           .replace(/https?:\/\/(www\.)?/, '')
           // remove :<port> and trailing slash
           .replace(/:\d+\/?/, '')
      : 'localhost';

   let protocol = 'http://';
   const certPath = path.resolve(paths.ROOT, paths.SSLCERT);
   const mkcertKeyPath = path.join(certPath, domain + '-key.pem');
   const mkcertCertPath = path.join(certPath, domain + '.pem');
   const gitIgnore = path.resolve(paths.ROOT, '.gitignore');
   const npmIgnore = path.resolve(paths.ROOT, '.npmignore');
   let gitIgnoreContent, npmIgnoreContent, sslKeyFile, sslCertFile;

   // git ignore certificate
   if (fs.existsSync(gitIgnore)) {
      gitIgnoreContent = fs.readFileSync(gitIgnore);

      if (!gitIgnoreContent.includes(paths.SSLCERT)) {
         this.clearScreen();
         this.consoleMsg.info(`Adding "${paths.SSLCERT}" to ".gitignore".`);

         gitIgnoreContent = paths.SSLCERT + '\n\n' + gitIgnoreContent;

         fs.writeFileSync(gitIgnore, gitIgnoreContent, {
            encoding: 'utf8',
         });
      }
   }

   // npm ignore certificate
   if (fs.existsSync(npmIgnore)) {
      npmIgnoreContent = fs.readFileSync(npmIgnore);

      if (!npmIgnoreContent.includes(paths.SSLCERT)) {
         this.consoleMsg.info(`Adding "${paths.SSLCERT}" to ".npmignore".`);

         npmIgnoreContent = paths.SSLCERT + '\n\n' + npmIgnoreContent;

         fs.writeFileSync(npmIgnore, npmIgnoreContent, {
            encoding: 'utf8',
         });
      }
   }

   if (!(fs.existsSync(mkcertCertPath) && fs.existsSync(mkcertKeyPath))) {
      // mkcert will fail if the dir does not exist.
      if (!fs.existsSync(certPath)) {
         fs.mkdirSync(certPath);
      }

      // If mkcert error
      if (
         // Callback makes it async.
         shell.exec(`cd ${certPath} && mkcert ${domain}`, { silent: true }).code
      ) {
         // appConsoleLog.warning(
         //    '\nMkcert is not installed on this machine. ' +
         //       '\nIf you want to use SSL in development, you will have to ' +
         //       'create certificate and configure server(s) manually.',
         // );
      } else {
         this.clearScreen();
         appConsoleLog.succes(
            `\nPlease find certificate for "${domain}" in "${paths.SSLCERT}" in your project's root.\n` +
               'Make sure to place this folder into your "ignore" files.\n' +
               'It was automatically added to ".gitignore" and ".npmignore", if they were found.',
         );
      }
   }

   if (fs.existsSync(mkcertCertPath) && fs.existsSync(mkcertKeyPath)) {
      sslKeyFile = mkcertKeyPath;
      sslCertFile = mkcertCertPath;
      protocol = 'https://';
   }

   return {
      protocol,
      domain,
      sslKeyFile,
      sslCertFile,
   };
})();

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
