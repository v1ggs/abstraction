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
- [REQUIREMENTS](#requirements)
- [FEATURES](#features)
- [USAGE](#usage)
	- [Install](#install)
	- [Prepare linters](#prepare-linters)
	- [Prepare SSL](#prepare-ssl)
	- [Run](#run)
	- [Build polyfills for manual usage](#build-polyfills-for-manual-usage)
- [MODES](#modes)
	- [Build with `.browserslistrc`](#build-with-browserslistrc)
	- [Build for differential serving](#build-for-differential-serving)
- [CONFIG](#config)
	- [Path](#path)
	- [Globals](#globals)
	- [JavaScript](#javascript)
	- [CSS](#css)
	- [Templates](#templates)
	- [SVG](#svg)
	- [Images](#images)
	- [Differential serving](#differential-serving)
	- [Polyfills](#polyfills)
	- [.assets.json](#assetsjson)
	- [Server](#server)
	- [CMS](#cms)
- [CODE QUALITY](#code-quality)
	- [Formatting](#formatting)
	- [Linting](#linting)
		- [JavaScript](#javascript-1)
		- [SCSS](#scss)
	- [Editor integration](#editor-integration)
- [CHANGELOG](#changelog)
- [LICENSE](#license)

## INFO

> **Documentation is still work in progress...**

This tool can work without any configuration, just make sure your source dir is `<project root>/src` and your index file is `<project root>/src/index.js`. Working with a CMS requires some config.

It is based on Webpack, so you can use its features, like code splitting, tree shaking, hot module replacement...

The default `.browserslistrc` config is being used. If you need a different browser support, configure `.browserslistrc` accordingly or delete it to use differential serving. Bundles are polyfilled automatically (babel), and CSS is prefixed (autoprefixer).

In "differential serving" mode, you DON'T NEED two entry points for each build. JavaScript will produce two bundles (modern and legacy) for each entry point (and chunks), and CSS will be prefixed with legacy browsers configuration.

> - A basic knowledge of Webpack is requried.

## REQUIREMENTS

- [Node.js](https://nodejs.org/)
- NPM (comes with Node.js)
- Editor extensions: [ESLint](https://eslint.org/docs/latest/user-guide/integrations), [Stylelint](https://github.com/stylelint/awesome-stylelint/#editor-integrations) and [Prettier](https://prettier.io/docs/en/editors.html), for a better developer experience (**optional**).
- A local backend server, if you're working with a CMS

## FEATURES

- Build and transpile JavaScript, based on `.browserslistrc` and automatically polyfill with core-js
- CSS: prefix, remove unused CSS (removed selectors go to a log), convert pixels to rems, sort media-queries, fix flexbox bugs
- Differential serving (module/nomodule) is configured automatically, just delete `.browserslistrc`
- Option to make a JavaScript polyfills bundle manually and conditionally import it where required
- Sourcemaps for JavaScript and CSS in development environment
- Lint code while you're working (use `.eslintrc` and `.stylelintrc`)
- An `.assets.json` file contains built files, together with additional information, for usage with other tools
- Work with templates (nunjucks by default), another loader can be added easily (don't import templates in js)
- Create SVG sprites and load them automatically into HTML (supported by modern and legacy browsers)
- Optimise images
- Extract licenses and add those that are not being found automatically
- Automatically restart the application on config change
- SSL for local development, if you have [mkcert](https://github.com/FiloSottile/mkcert) installed
- Develop with for CMS, with all webpack's features (a local backend domain required)

## USAGE

### Install

```sh
npm i -D @v1ggs/abstraction
```

### Prepare linters

```sh
# Use recommended rules for Prettier, ESLint and StyleLint
npx abs-prepare
```

### Prepare SSL

In order to use SSL in the development, you should have [mkcert](https://github.com/FiloSottile/mkcert) installed on your computer. Then create a certificate with:

```sh
npx abs-prepare-ssl
```

For a front-end project, a certificate will be created for `localhost`. If you're working in a combination with a CMS, first configure `server.backend` (see [Server section](#server)), then run the command.

When you [run](#run) the server, the certificate will be found and used automatically.

> IMPORTANT:
>
> - The certificate is created in `.cert` folder in the project's root. The folder should be automatically added to `.gitignore` and `.npmignore`, if they are found. **Please check**. If you use other "ignore" files, please add the folder manually.
>
> - If you don't use [mkcert](https://github.com/FiloSottile/mkcert), you need to have an SSL certificate for `server.backend`. Then see [Server section](#server) for an example how to use it.
>
> - You may need to redirect your local backend domain to `127.0.0.0` or `0.0.0.0` with hosts file.

### Run

```sh
# Run server in development mode
npx abs-run
```

```sh
# Build files in production mode (without serving)
npx abs-build
```

You may also need:

```sh
# Run server in production mode
npx abs-run-prod
```

```sh
# Build files in production mode (without serving)
npx abs-build-dev
```

### Build polyfills for manual usage

```sh
npx abs-build-polyfills
```

## MODES

Abstraction has two working modes:

- Build bundles using `.browserslistrc` configuration for polyfilling and prefixing
- Build two bundles for each entry/chunk, one with modern/es6 code, and the other with legacy/es5 code (differential serving)

### Build with `.browserslistrc`

- Configure targeted browsers in `.browserslistrc` (optional)
- [Run abstraction the way you want](#run)

### Build for differential serving

- Delete `.browserslistrc`
- [Run abstraction the way you want](#run)

In a front-end project, the bundles will be included in HTML, so that you can test both modern and legacy bundles at the same time, one in a modern, the other in a legacy browser (even, now unsupported, IE11).

If you're using templates, this will work if your template has `<head></head>` section.\
If you don't use templates, it's automatically configured.\
If you're working with a CMS, include both `es5` and `es6` bundles with PHP, reading information from `.assets.json`. Then use `type="module"` attribute for `es6` and `nomodule defer` for `es5`.

## CONFIG

Create `.abstraction.config.js` in the root of your project (you can find the default config [here](https://github.com/v1ggs/abstraction/blob/main/config/config.defaults.js)).

### Path

Override the default `src` and `dist` directories.

```js
// .abstraction.config.js
module.exports = {
   path: {
      src: './path/to/src',
      dist: './path/to/dist',
   },
};
```

### Globals

If you need global variables in your source code, you can define them in the `globals: {},` object. The default variables are merged with this object.

```js
// .abstraction.config.js
module.exports = {
	// ...

   globals: {
		MY_GLOBAL_VAR: 'something',
	},
};
```

Default globals (can't be redeclared):

```js
module.exports = {
   globals: {
      PRODUCTION: true, // false in development
      PUBLIC_PATH: '/', // autoconfigured: '/' | 'protocol://domain:port/'
      REM_SIZE: 16, // configured in css settings
      DESIGN: 'mobile-first', // configured in css settings
		// not available in SCSS
      ENV_MAIN: true, // this is true in the modern bundle, false in the legacy
      ENV_LEGACY: true, // this is true in the legacy bundle, false in the modern
   },
};
```

Usage:

In JavaScript and templates, you can use them the way they are declared.\
In SCSS, they are converted to the SCSS style: **lowercased, prefixed with `$` and underscores are converted to dashes**.

Examples:

Templates (nunjucks example):

```html
{# Removes quotes #}
{% set path = PUBLIC_PATH | replace('"', '') %}
<script src="{{ path }}/js/index.js"></script>
```

JavaScript:

```js
// This will be removed completely in production (when minified).
if (!PRODUCTION) {
   console.log('This is NOT production.');
}
```

SCSS:

```scss
// Declared as `REM_SIZE: 16` (JS),
// converted to `$rem-size` (SCSS).
html {
   font-size: $rem-size + px;
}
```

### JavaScript

[Babel (preset-env)](https://babeljs.io/docs/babel-preset-env) is being used for transpilation and [core-js](https://github.com/zloirock/core-js) for automatic polyfilling. You can write code using latest JavaScript features, and produce bundles supported by your targeted browsers.

Core-js version will be automatically determined an applied to the babel config, for the latest polyfills to be available for usage.

[Terser](https://webpack.js.org/plugins/terser-webpack-plugin/) will minify code in `production` mode only.

- Configure supported browsers in `.browserslistrc`. If you want to work the "module/nomodule" way, just remove `.browserslistrc`.
- Use `.abstraction.config.js` in the root of your project and configure `javascript.entry`, the same way you would do with [the original webpack's config](https://webpack.js.org/concepts/entry-points/).
- If you have multiple entry points on a page, set `javascript.singleRuntimeChunk` to `true` (default: `false`).
- If you want to import your polyfills manually, set `javascript.polyfill` to `'manual'` (default: `'auto'`, available: `'auto'`, `'manual'`).
- There is also an option to configure the webpack's ProvidePlugin. It takes [the original configuration](https://webpack.js.org/plugins/provide-plugin/).

```js
// .abstraction.config.js
module.exports = {
	// ...

   javascript: {
      entry: {
         index: './src/index.js',
      },
      singleRuntimeChunk: false,
      polyfill: 'auto',
      providePlugin: {},
   },
}
```

> - Tip: As a rule of thumb: Use exactly one entry point for each HTML document. See the issue described [here](https://bundlers.tooling.report/code-splitting/multi-entry/#webpack) for more details.

### CSS

**This section needs better documentation.**

Use `css.baseFontSize` to set the default font size for the project. It will be used to convert `px` to `rem`. You can also use it in templates to set `html { font-size: $rem-size; }`. See more in [Globals section](#globals).

All `px` values are converted to `rem`, based on this setting.

Media queries will be grouped and sorted. Use `css.sortMQ` to sort them mobile/desktop-first way.

CSS is purged by default. Set `css.purge: false` to disable this. All templates and javascript are scanned for selectors and all found selectors will be kept. To keep certain selector, use `css.purge.keepSelectors` array. See example below.

```js
// .abstraction.config.js
module.exports = {
	// ...

   css: {
      baseFontSize: 16,
      sortMQ: 'desktop-first',
      purge: {
         keepSelectors: ['.selector-1', '.selector-2'], // these will stay in CSS
      },
   },
};
```

Usage:

Import your entry `.scss` files into the corresponding JavaScript entry.

Example for "homepage":

```js
// src/homepage.js
import './homepage.scss';
```

Other `.scss` partials, import them in the main `.scss` file. Example:

```scss
// homepage.scss
@import './header/index';
```

> - Use relative paths to your assets (fonts, images...), they will be appropriately resolved and processed.

### Templates

**This section needs better documentation.**

If you don't use templates, an HTML page will be automatically generated with `html-webpack-plugin`.

If you're working with templates, they should **NOT** be imported in JavaScript, they are automatically found and built. Template parts, that you import in other templates, should be partials (filenames prefixed with "_").

If you work with nunjucks (default), [simple-nunjucks-loader](https://www.npmjs.com/package/simple-nunjucks-loader) is used. You can override the default config in `templates.nunjucksOptions` object. It takes [the original configuration](https://www.npmjs.com/package/simple-nunjucks-loader#options).

```js
// .abstraction.config.js
module.exports = {
	// ...

   templates: {
      nunjucksOptions: {},
   },
}
```

If you use another loader, you need to configure it in `templates.customLoader` object.

- `templates.customLoader.fileTypes` option takes an array of file extensions processed with the loader (this is `test: <regex>` in webpack).
- `templates.customLoader.use` takes the loader's config (the same as [the webpack's `use` rule](https://webpack.js.org/configuration/module/#ruleuse)).

Example for [handlebars loader](https://www.npmjs.com/package/handlebars-loader):

```js
// .abstraction.config.js
module.exports = {
	// ...

   templates: {
      customLoader: {
         // Test files: an array, it will be converted to regex.
         fileTypes: ['handlebars'],
         use: ['handlebars-loader'],
      },
   },
}
```

> Reminder: don't import templates in JavaScript entries, they are automatically found and built.

### SVG

**This section needs better documentation.**

Import `.svg` file in the corresponding JavaScript file.

Example for a component "component-1":

```js
// src/components/component-1/index.js
import './icon.svg'
```

An SVG sprite, with all imported `.svg`s will be generated and injected into HTML with JS.

Then reference them with their IDs in HTML.

### Images

**This section needs better documentation.**

All images found in css and imported with JavaScript will be optimised.

### Differential serving

**This section needs better documentation.**

### Polyfills

**This section needs better documentation.**

### .assets.json

**This section needs better documentation.**

### Server

For a front-end project, you may not need any additional config. Webpack's devServer will serve files on `http://localhost:8080`.

If you're working with a CMS, devServer will serve files on your local backend domain, on port `8080`. Make sure it's available.

You can completely override the default devServer config in `server.devServer` object. It takes [the original config](https://webpack.js.org/configuration/dev-server/).

An example:

```js
// .abstraction.config.js
module.exports = {
	// ...

   server: {
	   backend: 'https://your-backend-domain.local/',

		// Override the default devServer config.
      devServer: {
			// Enable SSL and use a manually created SSL certificate.
			https: {
				ca: './path/to/server.pem',
				pfx: './path/to/server.pfx',
				key: './path/to/server.key',
				cert: './path/to/server.crt',
				passphrase: 'webpack-dev-server',
				requestCert: true,
			},
		},
	},
};
```

### CMS

If you're working with a CMS, you need a local domain with a CMS installed.

In `.abstraction.config.js`, set `server.backend` to your local back-end domain. All Webpack's features will be available.

In development environment, include only built JavaScript files, without CSS. Use `.assets.json` for all required info. The `assets.json` file will be served by devServer, on the local backend domain (configured in `server.backend`), on port `8080` (e.g. `https://yourdomain.local:8080/.assets.json`).

In production, include CSS as well.

For a differential serving, include both `es5` and `es6` bundles with PHP, reading information from `.assets.json`. Then use `type="module"` attribute for `es6` and `nomodule defer` for `es5`.

> IMPORTANT:
>
> - devServer will use the same domain as your backend. If you need your local backend to be on a certain port, avoid using `8080`, because it's reserved for devServer. You can also override the devServer port in `server.devServer`.

## CODE QUALITY

### Formatting

You can use [Prettier](https://prettier.io/docs/en/editors.html) editor extension, to format code. You may want to edit `.editorconfig`, `.prettierrc.js` and `.prettierignore` to fit your requirements.

> - NOTE: Formatting rules have been removed from linters.

### Linting

#### JavaScript

[ESLint](https://eslint.org/) is integrated into Webpack, with [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin), so that the code is being linted during the build process.

You can install [ESLint](https://eslint.org/docs/latest/user-guide/integrations) editor extension, to lint code while you're writting it.

> - You may want to edit `.eslintrc` to fit your requirements.

#### SCSS

[Stylelint](https://stylelint.io/) is integrated into Webpack, with [stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin), so that the code is being linted during the build process.

You can use [Stylelint](https://github.com/stylelint/awesome-stylelint/#editor-integrations) editor extension, to lint code while you're writting it.

> - You may want to edit `.stylelintrc` to fit your requirements.

### Editor integration

`.editorconfig` file configures editor and some of Prettier options.

If you're using editor extensions, then [Prettier](https://prettier.io/docs/en/editors.html) should be configured as the default code formatter.

> - Formatting rules have been removed from linters.

This is an example a config for VSCode:

```jsonc
{
 // ...

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
