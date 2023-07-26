#!/usr/bin/node

// Installs and configures linters
// Requires `RULESET` variable to be set when running with NODE:
// - undefined    - Recommended linting for JS and SCSS only
// - `psr2`       - Recommended linting for JS and SCSS, PSR2 for PHP
// - `psr12`      - Recommended linting for JS and SCSS, PSR12 for PHP
// - `wpcs`       - WordPress Coding Standards for JS, SCSS, PHP

// https://github.com/squizlabs/PHP_CodeSniffer

// https://github.com/PHPCompatibility/PHPCompatibility
// This is a set of sniffs for PHP CodeSniffer that checks for PHP
// cross-version compatibility. It will allow you to analyse your code for
// compatibility with higher and lower versions of PHP.

// https://github.com/WPTT/WPThemeReview
// WordPress Themes for which a hosting application has been made for the
// theme to be hosted in the theme repository on wordpress.org have to comply
// with a set of requirements before such an application can be approved.
// Additionally, there are also recommendations for best practices for themes.
// This project attempts to automate the code analysis part of the Theme Review
// Process as much as possible using static code analysis.

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
   if (!ruleset) return;

   const phpcsCfg = processFile(__dirname + '/../code/.phpcs.xml.dist');
   const composerCfg = processFile(__dirname + '/../code/composer.json');

   // Don't install wpthemereview, if not required.
   if (ruleset !== 'wpcs') {
      composerCfg.fileContent = composerCfg.fileContent.replace(
         /,?\s+"wptrt\/wpthemereview": "\*"/,
         '',
      );
   }

   writeFile(composerCfg.fileOutputPath, composerCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });

   exec('composer install', (error, stdout, stderr) => {
      consoleMsg.info('Preparing PHP_CodeSniffer.');
      consoleMsg.info(stderr);
      if (error !== null) {
         consoleMsg.info(error);
      }
   });

   // Set the minimum supported PHP version.
   if (minPhp) {
      phpcsCfg.fileContent = phpcsCfg.fileContent.replace(
         // As of PHPCompatibility 7.1.3, you can omit one part of the
         // range if you want to support everything above or below a
         // particular version, i.e. `use --runtime-set testVersion 7.0-`
         // to run all the checks for PHP 7.0 and above.
         /(<config name="testVersion" value=").*?(-" \/>)/,
         '$1' + minPhp + '$2',
      );
   }

   // Set the minimum supported WordPress version.
   if (minWp) {
      phpcsCfg.fileContent = phpcsCfg.fileContent.replace(
         /(<config name="minimum_supported_wp_version" value=").*?(" \/>)/,
         '$1' + minWp + '$2',
      );
   }

   // Configure linting standards for PHP_CodeSniffer.
   const patternLint =
      /(<!-- BEGIN Standards -->)[\s\S]*?(<!-- END Standards -->)/;

   // Remove WP standard.
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

   writeFile(phpcsCfg.fileOutputPath, phpcsCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });
};

const frontendLintSetup = (ruleset) => {
   const eslintCfg = processFile(__dirname + '/../code/.eslintrc');
   const stylelintCfg = processFile(__dirname + '/../code/.stylelintrc');

   if (ruleset === 'psr2' || ruleset === 'psr12' || !ruleset) {
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

      consoleMsg.info('Preparing ESLint and StyleLint.');
      exec(
         'npm install --save-dev ' +
            // Can't install prettier with abstraction, because with
            // the WP theme I need to use forked prettier.
            'prettier ' +
            'eslint-config-prettier ' +
            // Prettier config for stylelint is no longer required.
            'stylelint-config-recommended-scss',
         (error, stdout, stderr) => {
            console.log(stderr);
            console.log(stdout);
            if (error !== null) {
               consoleMsg.info(error);
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
            '\t\t"stylelint-config-recommended-scss"\n' +
            // A reminder:
            // As of Stylelint v15 all style-related rules have been
            // deprecated. If you are using v15 or higher and are not
            // making use of these deprecated rules, this plugin is no
            // longer necessary.
            // '\t"stylelint-config-prettier"\n' +
            '\t],',
      );
   } else if (ruleset === 'wpcs') {
      exec(
         'npm install --save-dev ' +
            // https://www.npmjs.com/package/@wordpress/stylelint-config
            // Stylelint configuration rules to ensure your CSS is compliant
            // with the WordPress CSS Coding Standards.
            // In addition to the default preset, there is also a SCSS preset.
            // This preset extends both @wordpress/stylelint-config and
            // stylelint-config-recommended-scss.
            '@wordpress/stylelint-config ' +
            // ESLint plugin including configurations and custom rules
            // for WordPress development.
            '@wordpress/eslint-plugin ' +
            // This is a fork of Prettier that adds a new command line
            // option --paren-spacing which inserts many extra spaces inside
            // parentheses, the way how projects in the WordPress ecosystem
            // (Calypso, Gutenberg, etc.) like to format their code.
            // https://www.npmjs.com/package/wp-prettier
            'prettier@npm:wp-prettier@latest', // by Automattic
         // It's not possible to define rules in prettier's rc file,
         // with @wordpress/prettier-config.
         // (https://www.npmjs.com/package/@wordpress/prettier-config),
         (error, stdout, stderr) => {
            console.log(stderr);
            console.log(stdout);
            if (error !== null) {
               consoleMsg.info(error);
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
            // '\t"prettier"\n' +
            '\t],',
      );

      stylelintCfg.fileContent = stylelintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n\t\t"@wordpress/stylelint-config/scss"\n\t],',
      );
   }

   writeFile(eslintCfg.fileOutputPath, eslintCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });
   writeFile(stylelintCfg.fileOutputPath, stylelintCfg.fileContent, (err) => {
      if (err) consoleMsg.severe(err);
   });
};

const ruleset = process.env.RULESET || false;
const minWp = process.env.MINWP || '5.0';
const minPhp = process.env.MINPHP || '5.4';

frontendLintSetup(ruleset);

if (ruleset) backendLintSetup(ruleset, minWp, minPhp);
