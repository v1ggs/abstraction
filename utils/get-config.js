// Merge config.defaults with user config.
// User config completely overwrites some properties.

const path = require('path');
const server = require('./get-config-server');
const { getUserConfig } = require('./get-config-user');
const configDefault = require('../config/config.defaults');
const { isProduction, isServing, isCMS } = require('./abstraction');
const { assetsJsonFilename } = require('../config/config.abstraction');
const {
   merge,
   fixPathForGlob,
   arrMergeDedupe,
   getFirstSubdirectories,
} = require('./js');

const userConfig = getUserConfig();

const config =
   userConfig && Object.keys(userConfig).length
      ? merge(configDefault, userConfig)
      : configDefault;

config.debug = !isProduction;

// Overwrite merged entry with the user's, if found.
if (
   userConfig?.javascript?.entry &&
   Object.keys(userConfig?.javascript?.entry).length
) {
   config.javascript.entry = userConfig.javascript.entry;
}

// Overwrite merged unacceptable licenses with the user's, if found.
if (
   Array.isArray(userConfig?.licenses?.unacceptable) &&
   userConfig?.licenses?.unacceptable.length
) {
   config.licenses.unacceptable = userConfig.licenses.unacceptable;
}

// ====================================================
// ============================================== PATHS
// ====================================================
// Configure paths here, not in `get-paths.js`,
// to avoid later circular dependencies.

// `fixPathForGlob` fixes `path.resolve()` on Windows.
// Required for some loaders.
const ROOT = fixPathForGlob(process.cwd());
const CACHE = path.join(ROOT, 'node_modules', '.cache');
const SRC_ABSOLUTE = fixPathForGlob(path.resolve(config.path.src));
const DIST_ABSOLUTE = fixPathForGlob(path.resolve(config.path.dist));

const SRC_DIRNAME = path.parse(config.path.src).base;
const DIST_DIRNAME = path.parse(config.path.dist).base;

config.paths = {
   ROOT: ROOT,
   LOGS: path.resolve(ROOT, 'logs'),
   PROJECT_DIRNAME: path.parse(ROOT).base,
   BABELCACHE: path.join(CACHE, 'babel-loader'),
   POLYFILLS: path.join(SRC_ABSOLUTE, '_corejs'),

   SRC: {
      dirname: SRC_DIRNAME,
      path: SRC_ABSOLUTE,
   },

   DIST: {
      dirname: DIST_DIRNAME,
      path: DIST_ABSOLUTE,
      // These are relative to the `DIST`
      // and are required for their loaders.
      css: 'css',
      javascript: 'js',
      images: 'img',
      svg: 'svg',
      fonts: 'fonts',
      audio: 'audio',
      video: 'video',
      icons: 'ico',
      documents: 'documents',
   },

   PUBLIC: !isCMS()
      ? // Frontend
        'auto'
      : // CMS
        !isServing
        ? 'auto'
        : // When serving (devserver), assets in CSS (images, fonts...),
          // will be looked for on the backend domain, where they are not.
          // They are being served with devServer, on another domain or port.
          // Script.src in HTML must be the publicPath.
          (server.isSsl ? 'https' : 'http') +
          '://' +
          server.url.domain +
          ':' +
          server.dsPort +
          '/',

   RESOLVE_ROOTS: arrMergeDedupe(
      SRC_ABSOLUTE,
      getFirstSubdirectories(SRC_ABSOLUTE),
   ),
};

// ====================================================
// ============================================ GLOBALS
// ====================================================
// Configure globals here, not in `get-globals.js`,
// to avoid later circular dependencies.

config.globals = Object.assign(config.globals, {
   PRODUCTION: isProduction,
   DESIGN: config.css.sortMQ,
   REM_SIZE: config.css.baseFontSize,
   PUBLIC_PATH: config.paths.PUBLIC,
   // for differential-scripts-loader
   assetsJsonFile: assetsJsonFilename,
});

const keys = Object.keys(config.globals);
const values = Object.values(config.globals).map(value => {
   if (typeof value === 'string') {
      // Required!!
      return (value = JSON.stringify(value));
   }

   return value;
});

for (let i = 0; i < values.length; i++) {
   config.globals[keys[i]] = values[i];
}

exports.config = config;
