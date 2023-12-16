const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const glob = require('glob');

// Makes a copy of an object, to prevent changing
// the 'original' when modifying the copy.
exports.cloneDeep = _.cloneDeep;

// recursive merge of objects
exports.mergeDeep = _.merge;

// webpack-merge provides a merge function that concatenates arrays and
// merges objects creating a new object. If functions are encountered,
// it will execute them, run the results through the algorithm, and then
// wrap the returned values within a function again.
// This behavior is particularly useful in configuring webpack although
// it has uses beyond it. Whenever you need to merge configuration objects,
// webpack-merge can come in handy.
// Limitations:
// Note that Promises are not supported! If you want to return a
// configuration wrapped within a Promise, merge inside one.
// Example: Promise.resolve(merge({ ... }, { ... })).
// https://www.npmjs.com/package/webpack-merge
exports.merge = require('webpack-merge').merge;

// Glob doesn't work with backward slashes:
// `path.join()`, `path.resolve()`... won't work on Windows.
// This function replaces backward with forward slashes.
exports.fixPathForGlob = _path => {
   return _path.replace(/[\\]/g, '/');
};

// Gets (sync) all directories in a specified path (one level deep).
// Excludes partials.
// Returns an array of paths.
exports.getFirstSubdirectories = dir => {
   dir = this.fixPathForGlob(dir);
   return glob.sync(dir + '/*', {
      ignore: [dir + '/**/*.*', dir + '/_*/**'],
   });
};

// Gets (sync) all dirs/subdirs in a specified path.
// Excludes partials.
// Returns an array of paths.
exports.getAllSubdirectories = dir => {
   dir = this.fixPathForGlob(dir);
   return glob.sync(dir + '/**', {
      ignore: [dir + '/**/*.*', dir + '/_*/**'],
   });
};

/**
 * This function scans all top level subtirectories in
 * cwd and finds the file that has been passed to it.
 *
 * @param {string} filename - file to get
 * @returns file path
 */
exports.scanDirsForFile = filename => {
   let theFile;

   this.getFirstSubdirectories(process.cwd()).every(dir => {
      if (fs.existsSync(path.resolve(dir, filename))) {
         theFile = path.resolve(dir, filename);

         // `every()` stops on `false`.
         return false;
      }

      // else the loop continues...
      return true;
   });

   return theFile;
};

// Merges and deduplicates arrays.
exports.arrMergeDedupe = (...args) => [...new Set(args.flat())];

// Creates a regex from an array of filetypes.
exports.filetypesArr2regex = filetypes =>
   // only 'i' flag for webpack
   new RegExp(`\\.(${filetypes.join('|')})$`, 'i');

// Creates a 'negative' regex from an array of filetypes.
// Use to do something if the string does not match the regex.
// https://stackoverflow.com/a/406408
exports.filetypes2negativeRegex = filetypes =>
   // only 'i' flag for webpack
   new RegExp(`((?!${filetypes.join('|')}).)`, 'i');

// Creates a regex from an array.
exports.array2regex = (arr, flags) => {
   // https://stackoverflow.com/a/66847749
   // Here is an improved version of the currently accepted answer presented
   // as a function that accepts an array of strings and an optional list of
   // flags (as a string). It accounts for strings containing special characters
   // and escapes them. It also sorts the strings in such a way so to function
   // as expected by the maximal munch principle.
   return new RegExp(
      arr
         // Escape special characters:
         // https://stackoverflow.com/a/400316
         // Commented out, to be able to send a regex string to the function.
         // .map( ( s ) => s.replace( /[.^$*+?()[{\|]/g, '\\$&' ) )
         // Sort for maximal munch
         .sort((a, b) => b.length - a.length)
         .join('|'),
      flags,
   );
};

// Creates a regex from a string and escapes special characters.
exports.string2regexEsc = (str, flags) => {
   return new RegExp(
      // Escape special characters:
      // https://stackoverflow.com/a/400316
      str.replace(/[.^$*+?()[{\|]/g, '\\$&'), // eslint-disable-line
      flags,
   );
};

// Takes a path (dir or file) and finds its path relative to
// the path passed as a second argument. If the path (the first
// arg) is not inside the dir (second arg), it returns false.
exports.pathRelative = (checkPath, againstPath) => {
   const relativePath = path.relative(againstPath, checkPath);
   // If the file/dir is outside of the directory,
   // path.relative returns a string starting with '../'
   if (relativePath.startsWith('..')) {
      return false;
   }
   return relativePath;
};

exports.randomString = () => {
   // https://stackoverflow.com/a/12502559
   return Math.random().toString(36).slice(2);
};
