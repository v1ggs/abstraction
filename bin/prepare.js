#!/usr/bin/env node

const { cp, existsSync } = require('fs');
const path = require('path');

const configFiles = [
   '.browserslistrc',
   '.dcignore',
   '.editorconfig',
   '.eslintrc',
   '.gitignore',
   '.prettierignore',
   '.prettierrc.js',
   '.stylelintrc',
];

// Copy config files
configFiles.forEach(file => {
   const srcFile = path.join(__dirname, '..', file);
   const destFile = path.join(process.cwd(), file);

   // Don't overwrite!
   if (!existsSync(destFile)) {
      // eslint-disable-next-line
      cp(srcFile, destFile, error => {
         // if (error) console.log(error);
      });
   }
});

// // Copy VSCode snippets
// const srcVsc = path.join(__dirname, '..', '.vscode');
// const destVsc = path.join(process.cwd(), '.vscode');
// // eslint-disable-next-line
// cp(srcVsc + '/', destVsc + '/', { recursive: true }, error => {
//    // if (error) console.log(error);
// });
