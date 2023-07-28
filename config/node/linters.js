#!/usr/bin/node

// =========================================================================
// Install and configure linters
// Requires `RULESET` variable to be set when running with NODE:
// - undefined    - Recommended linting for JS and SCSS only
// - `PSR2`       - Recommended linting for JS and SCSS, PSR2 for PHP
// - `PSR12`      - Recommended linting for JS and SCSS, PSR12 for PHP
// - `WPCS`       - WordPress Coding Standards for JS, SCSS, PHP
// =========================================================================

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
// https://github.com/PHPCompatibility/PHPCompatibility
// This is a set of sniffs for PHP CodeSniffer that checks for PHP
// cross-version compatibility. It will allow you to analyse your code for
// compatibility with higher and lower versions of PHP.
// =========================================================================
// https://github.com/WPTT/WPThemeReview
// WordPress Themes for which a hosting application has been made for the
// theme to be hosted in the theme repository on wordpress.org have to comply
// with a set of requirements before such an application can be approved.
// Additionally, there are also recommendations for best practices for themes.
// This project attempts to automate the code analysis part of the Theme Review
// Process as much as possible using static code analysis.
// =========================================================================

const { exec } = require('child_process');
const { parse, resolve } = require('path');
const { consoleMsg } = require('../../utils/abstraction');
const { writeFile, readFileSync, copyFile, writeFileSync } = require('fs');

// Possible options: undefined, PSR2, PSR12, WPCS
const ruleset = process.env.RULESET || false;

// https://make.wordpress.org/core/handbook/references/php-compatibility-and-wordpress-versions/
// Past changes to supported PHP versions have been as followed:
// In WordPress version 4.1: Added support for PHP 5.6.
// In WordPress 4.4: Added support for PHP 7.0 (dev note).
// In WordPress 4.7: Added support for PHP 7.1.
// In WordPress 4.9: Added support for PHP 7.2.
// In WordPress 5.0: Added support for PHP 7.3 (dev note).
// In WordPress 5.2: Dropped support for PHP 5.2, 5.3, 5.4, 5.5.
// In WordPress 5.3: Added support for PHP 7.4 (dev note).
// In WordPress 5.6: Added “beta support” for PHP 8.0 (dev note).
// In WordPress 5.9: Added “beta support” for PHP 8.1 (dev note).
// In WordPress 6.1: Added “beta support” for PHP 8.2 (dev note pending).
const minWp = process.env.MINWP || '5.0';

// https://www.php.net/releases/index.php
// Support for PHP 5 has been discontinued since 10 Jan 2019.
const minPhp = process.env.MINPHP || '7.1';

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
const phpcsCfg = processFile(__dirname + '/../code/.phpcs.xml.dist');
const composerCfg = processFile(__dirname + '/../code/composer.json');
const stylelintCfg = processFile(__dirname + '/../code/.stylelintrc');
const prettierCfg = processFile(__dirname + '/../code/.prettierrc.js');

const execCallback = (error, message) =>
   error ? consoleMsg.severe(error) : consoleMsg.info(message);

const installPrettier = () => {
   consoleMsg.info('Preparing Prettier, please wait.');

   exec(npmInst + 'prettier@3 --save-exact', err =>
      execCallback(err, 'Prettier installed succesfully.'),
   );

   if (ruleset === 'WPCS') {
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

      // It configures Prettier as well, that's why it's here.
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

const installFrontendLinter = () => {
   let command;

   if (ruleset === 'WPCS') {
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

const configureFrontendLinter = () => {
   if (ruleset === 'WPCS') {
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

const installBackendLinter = () => {
   if (ruleset !== 'WPCS') {
      // Remove wpthemereview from composer.json before install,
      // if not required.
      composerCfg.fileContent = composerCfg.fileContent.replace(
         /,?\s+"wptrt\/wpthemereview": "\*"/,
         '',
      );
   }

   // Write composer.json
   writeFileSync(composerCfg.outputPath, composerCfg.fileContent, 'utf-8');

   // Composer install
   consoleMsg.info('Preparing PHP_CodeSniffer, please wait.');

   exec('composer install', err =>
      execCallback(err, 'PHP_CodeSniffer is ready.'),
   );
};

// Edit .phpcs.xml.dist file
const configureBackendLinter = () => {
   // Configure linting standards for PHP_CodeSniffer.
   const patternLint =
      /(<!-- BEGIN Standards -->)[\s\S]*?(<!-- END Standards -->)/;

   // Remove WP standard config, if not using WPCS.
   const patternWP =
      /(<!-- BEGIN WordPress -->)[\s\S]*?(<!-- END WordPress -->)/;

   // Set the minimum supported PHP version.
   phpcsCfg.fileContent = phpcsCfg.fileContent
      .replace(
         // As of PHPCompatibility 7.1.3, you can omit one part of the
         // range if you want to support everything above or below a
         // particular version, i.e. `use --runtime-set testVersion 7.0-`
         // to run all the checks for PHP 7.0 and above.
         /(<config name="testVersion" value=").*?(-" \/>)/,
         '$1' + minPhp + '$2',
      )
      // Set the minimum supported WordPress version.
      .replace(
         /(<config name="minimum_supported_wp_version" value=").*?(" \/>)/,
         '$1' + minWp + '$2',
      );

   if (ruleset === 'PSR2' || ruleset === 'PSR12') {
      phpcsCfg.fileContent = phpcsCfg.fileContent
         .replace(
            patternLint,
            `<rule ref="${ruleset}">\n` +
               `\t\t<!-- Exclude ${ruleset} Rules Here -->\n` +
               `\t</rule>`,
         )
         // Remove WP standard.
         .replace(patternWP, '');
   }

   // Write phpcs config file.
   writeFile(phpcsCfg.outputPath, phpcsCfg.fileContent, err => {
      if (err) consoleMsg.severe(err);
   });
};

// Frontend
if (ruleset === 'PSR2' || ruleset === 'PSR12' || !ruleset) {
   installPrettier();
   installFrontendLinter();
   configureFrontendLinter();
} else if (ruleset === 'WPCS') {
   installPrettier();
   installFrontendLinter();
   configureFrontendLinter();
}

// Backend
if (ruleset) {
   installBackendLinter();
   configureBackendLinter();
}

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
