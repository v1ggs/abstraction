const fs = require('fs');
const path = require('path');
const { consoleMsg } = require('./abstraction');

exports.rdSync = (_path) => {
   try {
      return fs.rmSync(_path, {
         recursive: true,
         force: true,
      });
   } catch (error) {
      consoleMsg.error('Could not remove "' + _path + '" this time...');
   }
};

exports.mdSync = (_path) => {
   try {
      return fs.mkdirSync(_path, { recursive: true });
   } catch (error) {
      consoleMsg.error('Could not make "' + _path + '" this time...');
   }
};

// Writes files to disk synchronously and makes
// a dir, if it does'n exist.
exports.writeFileSync = function (file, content) {
   // get file path
   const getFile = path.parse(file);

   // make dir
   fs.mkdirSync(getFile.dir, { recursive: true });

   // write the file
   return fs.writeFileSync(file, content, { encoding: 'utf8' }, function (err) {
      if (err) {
         console.warn(
            'utils: writeFileSync() function error, writting file ' + file,
         );
         // console.log( err );
      }
   });
};

// Writes files to disk asynchronously and makes
// a dir, if it does'n exist.
exports.writeFileAsync = function (file, content) {
   // get file path
   const getFile = path.parse(file);

   // make dir
   fs.mkdirSync(getFile.dir, { recursive: true });

   // write the file
   return fs.writeFileSync(file, content, { encoding: 'utf8' }, function (err) {
      if (err) {
         console.warn(
            'utils: writeFileAsync() function error, writting file ' + file,
         );
         // console.log( err );
      }
   });
};
