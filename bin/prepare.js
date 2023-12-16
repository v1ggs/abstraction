#!/usr/bin/env node

const { cp } = require('fs');
const path = require('path');

const configFiles = [
   '.abstraction.config.js',
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
configFiles.forEach(file =>
   cp(
      path.join(__dirname, '..', file),
      path.join(process.cwd(), file),
      error => {
         if (error) console.log(error);
      },
   ),
);

// Copy VSCode snippets
cp(
   path.join(__dirname, '..', '.vscode') + '/',
   path.join(process.cwd(), '.vscode') + '/',
   { recursive: true },
   error => {
      if (error) console.log(error);
   },
);
