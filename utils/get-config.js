// Merge config.defaults with user config.
// User config completely overwrites some properties.

const path = require('path');
const { globals } = require('./get-globals');
const { isProduction } = require('./abstraction');
const { getUserConfig } = require('./get-config-user');
const configDefault = require('../config/config.defaults');
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

config.globals = globals;
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
   PUBLIC: config.paths.publicPath,
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
      icons: 'ico',
      fonts: 'fonts',
      audio: 'audio',
      video: 'video',
      documents: 'general',
   },

   RESOLVE_ROOTS: arrMergeDedupe(
      SRC_ABSOLUTE,
      getFirstSubdirectories(SRC_ABSOLUTE),
      // Resolving folders in `components` dir may cause problems
      // with some loaders when trying to import a component with
      // `components/some-component`. It's still required because
      // of purgecss, to analyse templates and js files.
      getFirstSubdirectories(SRC_ABSOLUTE + '/components'),
      getFirstSubdirectories(SRC_ABSOLUTE + '/assets'),
   ),
};

exports.config = config;
