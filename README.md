<p align="center">
	<br>
	<a href="https://github.com/v1ggs/abstraction">
		<img src="./assets/Abstraction-Banner.svg" height="300" alt="Abstraction">
	</a>
	<br>
</p>

<h2 align="center">Abstraction</h2>

<p align="center">Webpack simplified.</p>

<p align="center">
  	<a href="https://www.npmjs.com/package/@v1ggs/abstraction">
		<img alt="npm (scoped)" src="https://img.shields.io/npm/v/%40v1ggs/abstraction?logo=npm">
  	</a>
  	<a href="https://github.com/v1ggs/abstraction/blob/main/LICENSE">
  		<img alt="GitHub" src="https://img.shields.io/github/license/v1ggs/abstraction">
  	</a>
</p>


- [INFO](#info)
- [FEATURES](#features)
- [USAGE](#usage)
	- [Install](#install)
	- [Prepare linters](#prepare-linters)
	- [Run](#run)
	- [Build polyfills for manual usage](#build-polyfills-for-manual-usage)
	- [WordPress](#wordpress)
- [CONFIG](#config)
- [CODE QUALITY](#code-quality)
	- [Linting](#linting)
		- [JavaScript](#javascript)
		- [SCSS](#scss)
	- [Formatting](#formatting)
	- [Editor integration](#editor-integration)
- [CHANGELOG](#changelog)
- [LICENSE](#license)

## INFO

> **Docs are in the process of creation...**
>
> This tool is based on Webpack, so you can use its features, like code splitting, tree shaking, dynamic imports, hot module replacement.

## FEATURES

- Work with templates, nunjucks by default, another loader can be added easily in the config
- Option to develop with WordPress with webpack's HMR (a local backend domain required)
- Transpile javascript, based on .browserslistrc and automatically polyfill with core-js
- Sourcemaps for JavaScript and SCSS
- Use differential serving (module/nomodule), it is configured automatically, just remove .browserslistrc file
- Prefix and purge css, convert pixels to rems, sort media-queries, fix flexbox bugs
- Create svg sprites and load them automatically into HTML (supported by modern and legacy browsers)
- Optimise images
- Lint code while you're working
- Automated linters configuration
- Automatic SSL for local development, if you have [mkcert](https://github.com/FiloSottile/mkcert) installed
- Extract and add custom licenses that are not included automatically
- Automatically restart the application on config change

## USAGE

### Install

```sh
npm i -D @v1ggs/abstraction
```

### Prepare linters

```sh
# Use recommended rules for ESLint (javascript) and StyleLint (scss)
npx abs-prepare
```

```sh
# OR
# Use recommended rules for WordPress (WordPress Coding Standards)
npx abs-prepare-wp
```

### Run

```sh
# Run server in development mode
npx abs-run
```

```sh
# Run server in production mode
npx abs-run-prod
```

```sh
# Build files in development mode
npx abs-build
```

```sh
# Build files in production mode
npx abs-build-prod
```

### Build polyfills for manual usage

```sh
# Build a file with core-js polyfills, based on your code and targeted
# browsers, so that you can conditionally import them in your code.
# You can find the files in "src/core-js-polyfills".
npx abs-build-polyfills
```

### WordPress

If you're building a WordPress theme, you will need a local domain with installed WordPress.\
Then use `.abstraction.config.js` file in the root directory, and set `server.proxy` to the local domain, and the proxy will be automatically configured. All Webpack's features will be available.

## CONFIG

This is the full config file, found in the root directory, commented for explanations.

```js
// .abstraction.config.js

module.exports = {
   // Defines global variables that will be available in code.
   // Default variables will be added to this object.
   globals: {},

   // This is only used when working with WordPress and
   // the theme dir has been moved to another location:
   // https://developer.wordpress.org/reference/functions/register_theme_directory/
   publicPath: undefined,

   javascript: {
      // Webpack's entry: https://webpack.js.org/concepts/entry-points/
      // Tip: As a rule of thumb: Use exactly one entry point for each HTML document.
      // See the issue described here for more details:
      // https://bundlers.tooling.report/code-splitting/multi-entry/#webpack
      entry: {
         index: './src/index.js',
      },

      // If you have multiple entry points on a page, set this `true`.
      singleRuntimeChunk: false,

      // Use babel (core-js) polyfills: 'auto' | 'manual' | false.
      polyfill: 'auto',

      // https://webpack.js.org/plugins/provide-plugin/
      // Automatically load modules instead of having to import or
      // require them everywhere.
      providePlugin: {
         // Example:
         // $: 'jquery', // in a module: $('#item'); <= works
         // jQuery: 'jquery', // in a module: jQuery('#item'); <= works
      },
   },

   css: {
      // Base size for converting pixels to rems. Set `false` to prevent
      // converting pixels to rems. It's available in scss.
      px2rem: 16,

      // Group and sort media queries (mobile/desktop first way).
      // Set `false` to prevent grouping and sorting media queries.
      sortMQ: 'mobile-first',

      // Removes unused selectors from css. Removed selectors can be found
      // in the `logs` folder in the project's root.
      // Set `purge: false` to prevent purging css.
      purge: {
         keepSelectors: [],
      },
   },

   templates: {
      // simple-nunjucks-loader options
      // https://www.npmjs.com/package/simple-nunjucks-loader
      nunjucksOptions: {},

      // Use a different loader for templates
      customLoader: {
         // Test files: an array, will be converted to regex.
         fileTypes: [],

         // Array of objects with 'loader' and 'options' properties,
         // just like webpack's `module.rules` or `use: []`.
         use: [],
      },
   },

   images: {
      // Images quality 0-100.
      quality: 80,

      // 'default' will apply 'preset-default'.
      // 'default-light': 'preset-default', but keeps title, description and comments.
      // 'default-light-no-comments': 'preset-default', but keeps title and description.
      minifySvg: 'default',
   },

   licenses: {
      // License file is being created automatically for JavaScript packages.
      // For sass packages, use the `include` array (the name of the package).
      // Example: `include: ['some-module'],`
      include: [],

      // Exclude unwanted licenses. Example: `exclude: ['some-module'],`
      exclude: [],

      // When using a package with one of these licenses, webpack will
      // throw an error. Completely overwritten with user's config.
      unacceptable: ['GPL', 'AGPL', 'LGPL', 'NGPL'],
   },

   server: {
      // Local backend domain, e.g. 'http://abstraction.local',
      // for WordPress development.
      proxy: undefined,

      // https://webpack.js.org/configuration/dev-server/
      // Complete devServer config, merged with the default.
      devServer: {},

      // https://browsersync.io/docs/options/
      // Complete BrowserSync config, merged with the default.
      // BrowserSync is used only when developing with WordPress.
      browserSync: {},
   },
};
```

## CODE QUALITY

It's recommended to use editor extensions for [ESLint](https://eslint.org/docs/latest/user-guide/integrations), [Stylelint](https://stylelint.io/) and [Prettier](https://prettier.io/docs/en/editors.html), to be able to see and fix all errors in code while you're writting.

### Linting

ESLint and Stylelint are integrated into Webpack, with [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin) and [stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin), so that the code is being linted during the build process.

Configuration files `.eslintrc` and `.stylelintrc`, found in the root directory, are being used to configure linters for JavaScript ([ESLint](https://eslint.org/docs/latest/user-guide/integrations)) and SCSS ([Stylelint](https://stylelint.io/)). They are configured automatically, but you can change them to fit your requirements.

#### JavaScript

ESLint will lint javascript and [Prettier](https://prettier.io/docs/en/editors.html) will take care of formatting.

#### SCSS

StyleLint will not display formatting errors in the editor: it will lint the code and [Prettier](https://prettier.io/docs/en/editors.html) will take care of formatting.

### Formatting

Configuration file `.prettierrc.js` is being used to configure [Prettier](https://prettier.io/docs/en/editors.html), a code formatter for JavaScript and SCSS. It is configured automatically, but you can change it to fit your requirements.

### Editor integration

.editorconfig file configures editor and Prettier automatically.\
If you're using editor extensions for [ESLint](https://eslint.org/docs/latest/user-guide/integrations), [Stylelint](https://stylelint.io/) and [Prettier](https://prettier.io/docs/en/editors.html), then [Prettier](https://prettier.io/docs/en/editors.html) should be set as the default code formatter. For VSCode it looks like this:

```jsonc
{
	"prettier.enable": true,
	// JS
	"eslint.enable": true,
	"[javascript]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode",
		"editor.formatOnSave": true,
		"editor.formatOnPaste": true,
	},
	// (S)CSS
	// Disable vscode built-in validation.
	"scss.validate": false,
	"less.validate": false,
	"css.validate": false,
	// Use stylelint.
	"stylelint.enable": true,
	"[scss]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode",
		"editor.formatOnSave": true,
		"editor.formatOnPaste": true,
	},
	"[css]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode",
		"editor.formatOnSave": true,
		"editor.formatOnPaste": true,
	},
	"stylelint.validate": [
		"sass",
		"scss",
		"css"
	],
	"stylelint.snippet": [
		"sass",
		"scss",
		"css"
	],
}
```

## CHANGELOG

[CHANGELOG](CHANGELOG.md)

## LICENSE

[MIT](LICENSE)
