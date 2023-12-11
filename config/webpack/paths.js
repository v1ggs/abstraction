// ############################################################################
// ###################################################################### PATHS
// ############################################################################
const ROOT = process.cwd();
const path = require('path');
const TEMPLATES = 'templates';
const themeDirName = path.parse(process.cwd()).base;
const CACHE = path.join(ROOT, 'node_modules', '.cache');
const { fixPathForGlob } = require('../../utils/js');
const { getUserConfig } = require('../../utils/get-user-config');

const userConfig = getUserConfig();
const customThemeDir = userConfig?.publicPath;

const appDirRelative = path.relative(
   process.cwd(),
   path.resolve(__dirname, '..', '..'),
);

const appDirAbsolute = path.resolve(process.cwd(), appDirRelative);

const appDir = {
   rootRelative: appDirRelative,
   absolute: appDirAbsolute,
};

exports.SRC = 'src';
exports.DIST = 'public';

exports.paths = {
   ROOT,
   LOGS: path.resolve(ROOT, 'logs'),
   PUBLIC: '/',
   PUBLICWP: customThemeDir
      ? customThemeDir
      : `/wp-content/themes/${themeDirName}/${this.DIST}/`,
   THEMEDIR: themeDirName,
   TEMPLATES: path.resolve(ROOT, this.SRC, TEMPLATES),
   POLYFILLS: path.resolve(ROOT, this.SRC, '_corejs'),
   BABELCACHE: path.join(CACHE, 'babel-loader'),
   ABSTRACTIONDIR: appDir,
   ABSTRACIONTEMP: path.join(CACHE, 'abstraction-temp'),
   SSLCERT: '.cert',

   SRC: {
      dirname: this.SRC,
      // fixPathForGlob fixes resolve.roots for some loaders
      absolute: fixPathForGlob(path.resolve(ROOT, this.SRC)),
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
