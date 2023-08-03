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

const { execSync } = require('child_process');
const { parse, resolve } = require('path');
const { consoleMsg } = require('../../utils/abstraction');
const { writeFile, readFileSync, copyFile } = require('fs');

const processFile = filepath => {
   const srcFile = resolve(filepath);
   const fileName = parse(filepath).base;
   const fileContent = readFileSync(filepath, 'utf-8');
   const outputPath = resolve(
      process.cwd(),
      fileName === 'gitignore' ? '.' + fileName : fileName,
   );

   return { srcFile, fileName, fileContent, outputPath };
};

const npmInst = 'npm install --save-dev ';
const eslintCfg = processFile(__dirname + '/../code/.eslintrc');
const editorCfg = processFile(__dirname + '/../code/.editorconfig');
const stylelintCfg = processFile(__dirname + '/../code/.stylelintrc');
const prettierCfg = processFile(__dirname + '/../code/.prettierrc.js');

// Must use execSync, otherwise only the last installed
// package will show up in `package.json`.
const execSyncFn = (command, packageName) => {
   try {
      execSync(command);

      consoleMsg.info(packageName + ' installed succesfully.');
   } catch (err) {
      // console.log('output', err);
      // console.log('sdterr', err.stderr.toString());

      consoleMsg.severe(
         'An error occured while installing ' +
            packageName +
            '\n' +
            'The process will stop now, please try again.' +
            '\n' +
            'If the error happens again, try removing `node_modules`, `package.json` and `package-lock.json ' +
            'and then reinstall the app.' +
            '\n' +
            "Don't forget `npm init`",
      );
   }
};

const installFromatter = IS_WP => {
   consoleMsg.info('Preparing Prettier, please wait.');

   execSyncFn(npmInst + 'prettier@3 --save-exact', 'Prettier');

   if (IS_WP) {
      execSyncFn(
         npmInst + '@wordpress/prettier-config@2 ',
         'Prettier config for WordPress',
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

const installLinter = IS_WP => {
   consoleMsg.info('Preparing ESLint and StyleLint, please wait.');

   // Lock major versions, and update ocasionally.

   // All installs separated, because they may take
   // too long to install, and without any feedback,
   // it may seem that the process stopped.
   if (IS_WP) {
      // WordPress Coding Standards

      // Recomended config is included in eslint.
      execSyncFn(npmInst + 'eslint@8', 'ESLint');

      // https://www.npmjs.com/package/@wordpress/eslint-plugin
      // The recommended preset includes prettier plugin
      // and will display formatting errors in code.
      // Therefore I'll use 'recommended-with-formatting', and turn of
      // formatting rules with `eslint-config-prettier`. There is no
      // other sensible solution for now.
      execSyncFn(
         npmInst + '@wordpress/eslint-plugin@14 eslint-config-prettier@8',
         'ESLint config for WordPress',
      );

      // @wordpress/stylelint-config does not work with StyleLint 15.
      execSyncFn(npmInst + 'stylelint@14', 'StyleLint');

      // https://www.npmjs.com/package/@wordpress/stylelint-config
      // In addition to the default preset, there is also a SCSS preset.
      // Does not contain formatting rules.
      execSyncFn(
         npmInst + '@wordpress/stylelint-config@21',
         'StyleLint config for Wordpress',
      );
   } else {
      // Recomended config is included in eslint.
      execSyncFn(npmInst + 'eslint@8', 'ESLint');

      execSyncFn(npmInst + 'eslint-config-prettier@8', 'ESLint config');

      // As of StyleLint 15, stylelint-config-prettier is no longer
      // required, because StyleLint removed its formatting rules.
      execSyncFn(npmInst + 'stylelint@15', 'StyleLint');

      execSyncFn(
         npmInst + 'stylelint-config-recommended-scss@12',
         'StyleLint config',
      );
   }
};

const configureLinter = IS_WP => {
   if (IS_WP) {
      // WordPress Coding Standards

      eslintCfg.fileContent = eslintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            // The recommended preset includes prettier plugin
            // and will display formatting errors in code.
            // Therefore I'll use 'recommended-with-formatting', and turn of
            // formatting rules with `eslint-config-prettier`. There is no
            // other sensible solution for now.
            '\t\t"plugin:@wordpress/eslint-plugin/recommended-with-formatting",\n' +
            // this is actually 'eslint-config-prettier'
            '\t\t"prettier"\n' +
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

module.exports = IS_WP => {
   installLinter(IS_WP);
   configureLinter(IS_WP);
   installFromatter(IS_WP);

   // Copy other config files
   [
      processFile(__dirname + '/../code/gitignore'),
      processFile(__dirname + '/../code/.browserslistrc'),
      processFile(__dirname + '/../code/.prettierignore'),
   ].forEach(file =>
      copyFile(file.srcFile, file.outputPath, err => {
         if (err) consoleMsg.severe(err);
      }),
   );
};
