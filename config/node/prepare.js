// This installs required dependencies and sets the required configuration
// Requires an `SETUP_CONFIG` variable to be set when running with NODE:
// - `wp`         - Standard linting config for JS, SCSS, PHP
// - `wpcs`       - WordPress Coding Standards for JS, SCSS, PHP
// - `frontend`   - Standard/recommended linting config for JS and SCSS

const { exec } = require('child_process');
const { parse, resolve } = require('path');
const { readFile, writeFile } = require('fs');
const { consoleMsg } = require('../../utils/abstraction');

const processFile = (filepath) => {
   const fileName = parse(filepath).base;
   const fileContent = readFile(filepath, 'utf-8');
   const fileOutputPath = resolve(process.cwd(), fileName);

   return { fileName, fileContent, fileOutputPath };
};

const eslintCfg = processFile('../code/.eslintrc');
const stylelintCfg = processFile('../code/.eslintrc');

const frontendLintSetup = (type) => {
   consoleMsg.info(
      'Installing required configurations for ESLint and StyleLint.',
   );

   if (type === 'standard') {
      // Linters usually contain not only code quality rules, but also
      // stylistic rules. Most stylistic rules are unnecessary when
      // using Prettier, but worse – they might conflict with Prettier!
      // Use Prettier for code formatting concerns, and linters for
      // code-quality concerns, as outlined in Prettier vs. Linters.
      // Luckily it’s easy to turn off rules that conflict or are
      // unnecessary with Prettier, by using these pre-made configs:
      // https://github.com/prettier/eslint-config-prettier
      // https://github.com/prettier/stylelint-config-prettier
      // When searching for both Prettier and your linter on the
      // Internet you’ll probably find more related projects.
      // These are generally not recommended, but can be useful in
      // certain circumstances...
      // Read at: https://prettier.io/docs/en/integrating-with-linters.html

      exec(
         `npm install --save-dev` +
            `prettier` +
            `eslint-config-prettier` +
            // Prettier config for stylelint no longer required.
            `stylelint-config-recommended-scss`,
      );

      eslintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            '\t"eslint:recommended",\n' +
            // this is actually `eslint-config-prettier`
            '\t"prettier"\n' +
            '],',
      );

      stylelintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            // This does not include formatting rules.
            '\t"stylelint-config-recommended-scss",\n' +
            // Leave this here as a document, if you forget:
            // As of Stylelint v15 all style-related rules have been
            // deprecated. If you are using v15 or higher and are not
            // making use of these deprecated rules, this plugin is no
            // longer necessary.
            // '\t"stylelint-config-prettier"\n' +
            '],',
      );

      writeFile(eslintCfg.fileOutputPath, eslintCfg.fileContent, 'utf-8');
      writeFile(stylelintCfg.fileOutputPath, stylelintCfg.fileContent, 'utf-8');
   } else if (type === 'wpcs') {
      exec(
         `npm install --save-dev` +
            // In addition to the default preset, there is also a SCSS preset.
            // This preset extends both @wordpress/stylelint-config and
            // stylelint-config-recommended-scss.
            `@wordpress/stylelint-config ` +
            // ESLint plugin including configurations and custom rules
            // for WordPress development.
            `@wordpress/eslint-plugin ` +
            // This is a fork of Prettier that adds a new command line
            // option --paren-spacing which inserts many extra spaces inside
            // parentheses, the way how projects in the WordPress ecosystem
            // (Calypso, Gutenberg, etc.) like to format their code.
            // https://www.npmjs.com/package/wp-prettier
            `prettier@npm:wp-prettier@latest`, // by Automattic
         // With @wordpress/prettier-config
         // (https://www.npmjs.com/package/@wordpress/prettier-config),
         // it's not possible to define more rules in prettier's rc file.
      );

      eslintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' +
            // The recommended preset will include rules governing an ES2015+
            // environment, and includes rules from the eslint-plugin-jsdoc,
            // eslint-plugin-jsx-a11y, eslint-plugin-react, and other similar
            // plugins.
            // There is also `recommended-with-formatting` ruleset for projects
            // that want to ensure that Prettier and TypeScript integration is
            // never activated. This preset has the native ESLint code
            // formatting rules enabled instead.
            '\t"plugin:@wordpress/eslint-plugin/recommended",\n' +
            // '\t"prettier"\n' +
            '],',
      );

      stylelintCfg.fileContent.replace(
         /"extends":\s*?\[[\s\S]*?\],/,
         '"extends": [\n' + '\t"@wordpress/stylelint-config/scss"\n' + '],',
      );

      writeFile(eslintCfg.fileOutputPath, eslintCfg.fileContent, 'utf-8');
      writeFile(stylelintCfg.fileOutputPath, stylelintCfg.fileContent, 'utf-8');
   } else {
      return false;
   }
};

module.exports = () => {
   // let phpcsCfg;

   if (process.env.SETUP_CONFIG === 'wp') {
      // WordPress with standard config
      return frontendLintSetup('standard');

      // TODO: add phpcs | Mon 24 Jul 2023, 20:00
   } else if (process.env.SETUP_CONFIG === 'wpcs') {
      // WordPress Coding Standards
      return frontendLintSetup('wpcs');

      // TODO: add phpcs | Mon 24 Jul 2023, 20:00
   } else if (process.env.SETUP_CONFIG === 'frontend') {
      // Standard config for front-end
      return frontendLintSetup('standard');
   }
};
