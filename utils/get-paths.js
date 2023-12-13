// ############################################################################
// ###################################################################### PATHS
// ############################################################################
const ROOT = process.cwd();
const path = require('path');
const TEMPLATES = 'templates';
const themeDirName = path.parse(process.cwd()).base;
const { getUserConfig } = require('./get-config-user');
const CACHE = path.join(ROOT, 'node_modules', '.cache');
const {
   fixPathForGlob,
   arrMergeDedupe,
   getFirstSubdirectories,
} = require('./js');

const userConfig = getUserConfig();
const customThemeDir = userConfig?.publicPath;

exports.SRC = 'src';
exports.DIST = 'public';
// fixPathForGlob fixes resolve.roots for some loaders
exports.SRC_ABSOLUTE = fixPathForGlob(path.resolve(ROOT, this.SRC));

exports.paths = {
   ROOT,
   PUBLIC: '/',
   PUBLICWP: customThemeDir
      ? customThemeDir
      : `/wp-content/themes/${themeDirName}/${this.DIST}/`,
   RESOLVE_ROOTS: arrMergeDedupe(
      this.SRC_ABSOLUTE,
      getFirstSubdirectories(this.SRC_ABSOLUTE),
      // Resolving folders in `components` dir may cause problems
      // with some loaders when trying to import a component with
      // `components/some-component`. It's still required because
      // of purgecss, to analyse templates and js files.
      getFirstSubdirectories(this.SRC_ABSOLUTE + '/components'),
   ),
   THEMEDIR: themeDirName,
   TEMPLATES: path.resolve(ROOT, this.SRC, TEMPLATES),
   POLYFILLS: path.resolve(ROOT, this.SRC, '_corejs'),
   BABELCACHE: path.join(CACHE, 'babel-loader'),
   LOGS: path.resolve(ROOT, 'logs'),
   SSLCERT: '.cert',

   SRC: {
      dirname: this.SRC,
      absolute: this.SRC_ABSOLUTE,
   },

   DIST: {
      dirname: this.DIST,
      absolute: path.resolve(ROOT, this.DIST),
      // these below are relative to the `DIST` and are
      // required for their loaders.
      css: 'css',
      javascript: 'js',
      images: 'img',
      icons: 'ico',
      fonts: 'fonts',
      audio: 'audio',
      video: 'video',
      documents: 'general',
   },
};
