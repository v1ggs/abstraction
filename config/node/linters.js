#!/usr/bin/node

// =========================================================================
// Install and configure linters
// Requires `RULESET` variable to be set when running with NODE:
// - undefined    - Recommended linting for JS and SCSS only
// - `psr2`       - Recommended linting for JS and SCSS, PSR2 for PHP
// - `psr12`      - Recommended linting for JS and SCSS, PSR12 for PHP
// - `wpcs`       - WordPress Coding Standards for JS, SCSS, PHP
// =========================================================================

const { exec } = require('child_process');
const { parse, resolve } = require('path');
const { writeFile, readFileSync } = require('fs');
const { consoleMsg } = require('../../utils/abstraction');

const processFile = (filepath) => {
   const fileName = parse(filepath).base;
   const fileContent = readFileSync(filepath, 'utf-8');
   const fileOutputPath = resolve(process.cwd(), fileName);

   return { fileName, fileContent, fileOutputPath };
};

const backendLintSetup = (ruleset, minWp, minPhp) => {
   // Docs:
   // https://github.com/squizlabs/PHP_CodeSniffer
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

   // If there's no ruleset, then it's frontend only.
   if (!ruleset) return;

   const phpcsCfg = processFile(__dirname + '/../code/.phpcs.xml.dist');
   const composerCfg = processFile(__dirname + '/../code/composer.json');

   // Remove wpthemereview from composer.json before install, if not required.
   if (ruleset !== 'wpcs') {
      composerCfg.fileContent = composerCfg.fileContent.replace(
         /,?\s+"wptrt\/wpthemereview": "\*"/,
         '',
      );
   }

   // Write composer.json
   writeFile(composerCfg.fileOutputPath, composerCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });

   // Composer install
   consoleMsg.info('Preparing PHP_CodeSniffer, please wait.');
   exec('composer install', (error /* , stdout, stderr */) => {
      // consoleMsg.info(stderr);
      if (error) {
         consoleMsg.severe(error);
      } else {
         consoleMsg.info('PHP_CodeSniffer is ready.');
      }
   });

   // Set the minimum supported PHP version.
   phpcsCfg.fileContent = phpcsCfg.fileContent.replace(
      // As of PHPCompatibility 7.1.3, you can omit one part of the
      // range if you want to support everything above or below a
      // particular version, i.e. `use --runtime-set testVersion 7.0-`
      // to run all the checks for PHP 7.0 and above.
      /(<config name="testVersion" value=").*?(-" \/>)/,
      '$1' + minPhp + '$2',
   );

   // Set the minimum supported WordPress version.
   phpcsCfg.fileContent = phpcsCfg.fileContent.replace(
      /(<config name="minimum_supported_wp_version" value=").*?(" \/>)/,
      '$1' + minWp + '$2',
   );

   // Configure linting standards for PHP_CodeSniffer.
   const patternLint =
      /(<!-- BEGIN Standards -->)[\s\S]*?(<!-- END Standards -->)/;

   // Remove WP standard, if not using wpcs.
   const patternWP =
      /(<!-- BEGIN WordPress -->)[\s\S]*?(<!-- END WordPress -->)/;

   if (ruleset === 'psr2') {
      phpcsCfg.fileContent = phpcsCfg.fileContent.replace(
         patternLint,
         '$1\n\t<rule  ref="PSR2"/>\n\t$2',
      );

      // Remove WP standard.
      phpcsCfg.fileContent = phpcsCfg.fileContent.replace(patternWP, '');
   } else if (ruleset === 'psr12') {
      phpcsCfg.fileContent = phpcsCfg.fileContent.replace(
         patternLint,
         '$1\n\t<rule  ref="PSR12"/>\n\t$2',
      );

      // Remove WP standard.
      phpcsCfg.fileContent = phpcsCfg.fileContent.replace(patternWP, '');
   }

   // Write phpcs config file.
   writeFile(phpcsCfg.fileOutputPath, phpcsCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });
};

const frontendLintSetup = (ruleset) => {
   // DOCS:
   // As of StyleLint 15, stylelint-config-prettier is no longer required,
   // because StyleLint removed its formatting rules.
   // On the other hand, @wordpress/stylelint-config does not yet work
   // with StyleLint 15.
   // Therefore using StyleLint 14, and watching for
   // @wordpress/stylelint-config update...
   // =========================================================================
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

   const eslintCfg = processFile(__dirname + '/../code/.eslintrc');
   const stylelintCfg = processFile(__dirname + '/../code/.stylelintrc');

   if (ruleset === 'psr2' || ruleset === 'psr12' || !ruleset) {
      consoleMsg.info('Preparing ESLint and StyleLint, please wait.');
      exec(
         // Lock minor versions, because we're installing them this way.
         // 'npm install --save-dev ' +
         'npm install --save ' +
            // Install prettier here, because with WP
            // theme we need another (forked) prettier.
            'prettier@3.0 ' +
            // Recomended config is included in eslint,
            // so install just eslint-config-prettier.
            'eslint-config-prettier@8.9 ' +
            // Last working with stylelint 14.
            'stylelint-config-recommended-scss@8.0 ' +
            // Still using stylelint 14.
            'stylelint-config-prettier@9.0',
         (error /* , stdout, stderr */) => {
            // console.log(stderr);
            // console.log(stdout);
            if (error) {
               consoleMsg.severe(error);
            } else {
               consoleMsg.info('ESLint and StyleLint are ready.');
            }
         },
      );

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
            '\t\t"stylelint-config-recommended-scss",\n' +
            // A reminder:
            // As of Stylelint v15 all style-related rules have been
            // deprecated. If you are using v15 or higher and are not
            // making use of these deprecated rules, this plugin is no
            // longer necessary.
            '\t\t"stylelint-config-prettier"\n' + // still using 14
            '\t],',
      );
   } else if (ruleset === 'wpcs') {
      consoleMsg.info('Preparing ESLint and StyleLint, please wait.');
      exec(
         // Lock minor versions, because we're installing them this way.
         // 'npm install --save-dev ' +
         'npm install --save ' +
            // https://www.npmjs.com/package/@wordpress/stylelint-config
            // Stylelint configuration rules to ensure your CSS is compliant
            // with the WordPress CSS Coding Standards.
            // In addition to the default preset, there is also a SCSS preset.
            // This preset extends both @wordpress/stylelint-config and
            // stylelint-config-recommended-scss.
            '@wordpress/stylelint-config@21.21 ' +
            // Still using stylelint 14.
            'stylelint-config-prettier@9.0 ' + // turns of formatting rules
            // https://www.npmjs.com/package/@wordpress/eslint-plugin
            // The recommended preset will include rules governing an ES2015+
            // environment, and includes rules from the eslint-plugin-jsdoc,
            // eslint-plugin-jsx-a11y, eslint-plugin-react, and other similar
            // plugins.
            // There is also 'recommended-with-formatting' ruleset for projects
            // that want to ensure that Prettier and TypeScript integration is
            // never activated. This preset has the native ESLint code
            // formatting rules enabled instead.
            // So no formatting, no eslint-config-prettier.
            '@wordpress/eslint-plugin@14.11 ' +
            // This is a fork of Prettier that adds a new command line
            // option --paren-spacing which inserts many extra spaces inside
            // parentheses, the way how projects in the WordPress ecosystem
            // (Calypso, Gutenberg, etc.) like to format their code.
            // https://www.npmjs.com/package/wp-prettier
            'prettier@npm:wp-prettier@2.8', // by Automattic
         // It's not possible to define rules in prettier's rc file,
         // with @wordpress/prettier-config.
         // (https://www.npmjs.com/package/@wordpress/prettier-config),
         (error /* , stdout, stderr */) => {
            // console.log(stderr);
            // console.log(stdout);
            if (error) {
               consoleMsg.severe(error);
            } else {
               consoleMsg.info('ESLint and StyleLint are ready.');
            }
         },
      );

      eslintCfg.fileContent = eslintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            // The recommended preset will include rules governing an ES2015+
            // environment, and includes rules from the eslint-plugin-jsdoc,
            // eslint-plugin-jsx-a11y, eslint-plugin-react, and other similar
            // plugins.
            // There is also 'recommended-with-formatting' ruleset for projects
            // that want to ensure that Prettier and TypeScript integration is
            // never activated. This preset has the native ESLint code
            // formatting rules enabled instead.
            '\t\t"plugin:@wordpress/eslint-plugin/recommended"\n' +
            '\t],',
      );

      stylelintCfg.fileContent = stylelintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            '\t\t"@wordpress/stylelint-config/scss",\n' +
            // A reminder:
            // As of Stylelint v15 all style-related rules have been
            // deprecated. If you are using v15 or higher and are not
            // making use of these deprecated rules, this plugin is no
            // longer necessary.
            '\t\t"stylelint-config-prettier"\n' + // still using 14
            '\t],',
      );
   }

   writeFile(eslintCfg.fileOutputPath, eslintCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });
   writeFile(stylelintCfg.fileOutputPath, stylelintCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });
};

// Possible options: undefined, psr2, psr12, wpcs
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

frontendLintSetup(ruleset);

if (ruleset) backendLintSetup(ruleset, minWp, minPhp);
