#!/usr/bin/node

// DOCS:
// Linters usually contain not only code quality rules, but also
// stylistic rules. Most stylistic rules are unnecessary when
// using Prettier, but worse – they might conflict with Prettier!
// Use Prettier for code formatting concerns, and linters for
// code-quality concerns, as outlined in Prettier vs. Linters.
// Luckily it's easy to turn off rules that conflict or are
// unnecessary with Prettier, by using these pre-made configs:
// https://github.com/prettier/eslint-config-prettier
// https://github.com/prettier/stylelint-config-prettier
// When searching for both Prettier and your linter on the
// Internet you'll probably find more related projects.
// These are generally not recommended, but can be useful in
// certain circumstances...
// Read at: https://prettier.io/docs/en/integrating-with-linters.html
// =========================================================================
// As of StyleLint 15, stylelint-config-prettier is no longer required,
// because StyleLint removed its formatting rules.
// On the other hand, @wordpress/stylelint-config does not work yet
// with StyleLint 15.
// Therefore using StyleLint 14 with WP, and watching for
// @wordpress/stylelint-config update...
// =========================================================================

// Set this true, to use WordPress Coding Standards.
const IS_WP = process.env.IS_WP;

const { exec } = require('child_process');
const { parse, resolve } = require('path');
const { consoleMsg } = require('../../utils/abstraction');
const { writeFile, readFileSync, copyFile, existsSync, mkdir } = require('fs');
const path = require('path');
const { paths } = require('../webpack/paths');

const processFile = filepath => {
   const srcFile = resolve(filepath);
   const fileName = parse(filepath).base;
   const fileContent = readFileSync(filepath, 'utf-8');
   const outputPath = resolve(process.cwd(), fileName);

   return { srcFile, fileName, fileContent, outputPath };
};

const npmInst = 'npm install --save ';
const eslintCfg = processFile(__dirname + '/../code/.eslintrc');
const editorCfg = processFile(__dirname + '/../code/.editorconfig');
const stylelintCfg = processFile(__dirname + '/../code/.stylelintrc');
const prettierCfg = processFile(__dirname + '/../code/.prettierrc.js');

const execCallback = (error, message) =>
   error ? consoleMsg.severe(error) : consoleMsg.info(message);

const createSource = () => {
   const srcDir = paths.SRC.absolute;
   const jsEntry = path.join(srcDir, 'index.js');
   const scssEntry = path.join(srcDir, 'index.scss');

   if (!existsSync(srcDir)) mkdir(srcDir, { recursive: true });

   writeFile(
      jsEntry,
      "// This is the JavaScript entry point.\n\nimport './index.scss'\n",
   );
   writeFile(scssEntry, '// This is the SCSS entry point.\n');
};

const installFromatter = () => {
   consoleMsg.info('Preparing Prettier, please wait.');

   exec(npmInst + 'prettier@3 --save-exact', err =>
      execCallback(err, 'Prettier installed succesfully.'),
   );

   if (IS_WP) {
      exec(npmInst + '@wordpress/prettier-config@2 ', err =>
         execCallback(
            err,
            'Prettier config for WordPress installed succesfully.',
         ),
      );

      // https://prettier.io/docs/en/configuration.html
      prettierCfg.fileContent =
         "const wpConfig = require('@wordpress/prettier-config');\n\n" +
         prettierCfg.fileContent.replace(
            'module.exports = {',
            'module.exports = {\n' + '\t...wpConfig,',
         );

      editorCfg.fileContent = editorCfg.fileContent.replace(
         '# indent_style = tab # WPCS',
         'indent_style = tab',
      );
   } else {
      editorCfg.fileContent = editorCfg.fileContent.replace(
         /# indent_style = tab # WPCS\s/g,
         '',
      );
   }

   writeFile(prettierCfg.outputPath, prettierCfg.fileContent, err => {
      if (err) consoleMsg.severe(err);
   });

   writeFile(editorCfg.outputPath, editorCfg.fileContent, err => {
      if (err) consoleMsg.severe(err);
   });
};

const installLinter = () => {
   let command;

   if (IS_WP) {
      // WordPress Coding Standards

      command = // Lock major versions, and update ocasionally.
         npmInst +
         // @wordpress/stylelint-config does not work with StyleLint 15.
         'stylelint@14 ' +
         // https://www.npmjs.com/package/@wordpress/stylelint-config
         // In addition to the default preset, there is also a SCSS preset.
         // Does not contain formatting rules.
         '@wordpress/stylelint-config@21 ' +
         // Recomended config is included in eslint,
         // so install just eslint-config-prettier.
         'eslint@8 ' +
         // https://www.npmjs.com/package/@wordpress/eslint-plugin
         // The recommended preset will include rules governing
         // an ES2015+ environment...
         // There is also 'recommended-with-formatting' ruleset.
         // So no formatting, no eslint-config-prettier.
         '@wordpress/eslint-plugin@14';
   } else {
      command = // Lock major versions, and update ocasionally.
         npmInst +
         // As of StyleLint 15, stylelint-config-prettier is no longer
         // required, because StyleLint removed its formatting rules.
         'stylelint@15 ' +
         'stylelint-config-recommended-scss@12 ' +
         // Recomended config is included in eslint,
         // so install just eslint-config-prettier.
         'eslint@8 ' +
         'eslint-config-prettier@8';
   }

   consoleMsg.info('Preparing ESLint and StyleLint, please wait.');

   return exec(command, err =>
      execCallback(err, 'ESLint and StyleLint are ready.'),
   );
};

const configureLinter = () => {
   if (IS_WP) {
      // WordPress Coding Standards

      eslintCfg.fileContent = eslintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            // The recommended preset will include rules governing
            // an ES2015+ environment...
            // There is also 'recommended-with-formatting' ruleset.
            '\t\t"plugin:@wordpress/eslint-plugin/recommended"\n' +
            '\t],',
      );

      stylelintCfg.fileContent = stylelintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            // does not contain formatting rules
            '\t\t"@wordpress/stylelint-config/scss"\n' +
            '\t],',
      );
   } else {
      eslintCfg.fileContent = eslintCfg.fileContent.replace(
         /"extends": \[\],/,
         '"extends": [\n' +
            '\t\t"eslint:recommended",\n' +
            // this is actually 'eslint-config-prettier'
            '\t\t"prettier"\n' +
            '\t],',
      );

      stylelintCfg.fileContent = stylelintCfg.fileContent.replace(
         /"extends": \[\],/,
         '"extends": [\n' +
            // This one does not include formatting rules.
            '\t\t"stylelint-config-recommended-scss"\n' +
            // A reminder:
            // As of Stylelint v15 all style-related rules have been
            // deprecated. If you are using v15 or higher and are not
            // making use of these deprecated rules, this plugin is no
            // longer necessary.
            // '\t\t"stylelint-config-prettier"\n' +
            '\t],',
      );
   }

   writeFile(eslintCfg.outputPath, eslintCfg.fileContent, err => {
      if (err) consoleMsg.severe(err);
   });

   writeFile(stylelintCfg.outputPath, stylelintCfg.fileContent, err => {
      if (err) consoleMsg.severe(err);
   });
};

createSource();
installLinter();
configureLinter();
installFromatter();

// Copy other config files
[
   processFile(__dirname + '/../code/.gitignore'),
   processFile(__dirname + '/../code/.browserslistrc'),
   processFile(__dirname + '/../code/.prettierignore'),
].forEach(file =>
   copyFile(file.srcFile, file.outputPath, err => {
      if (err) consoleMsg.severe(err);
   }),
);
