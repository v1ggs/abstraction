// ############################################################################
// ###################################################################### PATHS
// ############################################################################
const path = require('path');
const ROOT = process.cwd();
const TEMPLATES = 'templates';
const CACHE = path.join(ROOT, 'node_modules', '.cache');
const { themeDirName, appDir } = require('../abstraction/app.config');

exports.SRC = 'src';
exports.DIST = 'public';

exports.paths = {
   ROOT,
   LOGS: path.resolve(ROOT, 'logs'),
   PUBLIC: '/',
   PUBLICWP: `/wp-content/themes/${themeDirName}/${this.DIST}/`,
   THEMEDIR: themeDirName,
   TEMPLATES: path.resolve(ROOT, this.SRC, TEMPLATES),
   POLYFILLS: path.resolve(ROOT, this.SRC, 'core-js-polyfills'),
   BABELCACHE: path.join(CACHE, 'babel-loader'),
   ABSTRACTIONDIR: appDir,
   ABSTRACIONTEMP: path.join(CACHE, 'abstraction-temp'),
   SSLCERT: '.cert',

   SRC: {
      dirname: this.SRC,
      absolute: path.resolve(ROOT, this.SRC),
   },

   DIST: {
      dirname: this.DIST,
      absolute: path.resolve(ROOT, this.DIST),
      // these below are relative to the `DIST`.
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
