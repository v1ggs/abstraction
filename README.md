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

- [The Concept](#the-concept)
	- [How it works](#how-it-works)
	- [Motivation](#motivation)
- [Basic Usage Info](#basic-usage-info)
- [Requirements](#requirements)
- [Features](#features)
- [Getting Started](#getting-started)
	- [Install](#install)
	- [Prepare linters](#prepare-linters)
	- [Prepare SSL](#prepare-ssl)
	- [Run](#run)
- [Modes](#modes)
	- [Build with `.browserslistrc`](#build-with-browserslistrc)
	- [Build for differential serving (module/nomodule)](#build-for-differential-serving-modulenomodule)
- [Config](#config)
	- [`path = {}`](#path--)
	- [`globals = {}`](#globals--)
	- [`javascript = {}`](#javascript--)
	- [`css = {}`](#css--)
	- [`templates = {}`](#templates--)
	- [`svg = {}`](#svg--)
		- [Config](#config-1)
		- [Usage](#usage)
	- [`images = {}`](#images--)
	- [`server = {}`](#server--)
- [Polyfills](#polyfills)
	- [Build polyfills for manual usage](#build-polyfills-for-manual-usage)
- [Assets.json](#assetsjson)
- [CMS](#cms)
- [Code Quality](#code-quality)
	- [Formatting](#formatting)
	- [Linting](#linting)
		- [JavaScript](#javascript)
		- [SCSS](#scss)
	- [Editor integration](#editor-integration)
- [Useful Docs](#useful-docs)
- [Changelog](#changelog)
- [License](#license)

**Still under development. New minor version may introduce breaking changes. See [CHANGELOG](CHANGELOG.md)**.

## The Concept

The main focus of this tool is simplicity of usage.

The config for Webpack and its loaders and plugins has been abstracted to include only as few (self-explanatory) options as possible. As a consequence, a detailed control over the build process is not available.

Support for frameworks like React is not available either.

If these are essential requirements, using another tool or creating a Webpack config manually is probably a better option.

### How it works

Abstraction uses provided configuration (user's or default) to activate and configure required loaders and plugins, as well as Webpack itsef. Then it combines it all in one config and applies it to Webpack. Everything else is handled by Webpack.

It is based on [Webpack 5](https://webpack.js.org/), and you can use its features, like [code splitting](https://webpack.js.org/guides/code-splitting/), [dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports) with [magic comments](https://webpack.js.org/api/module-methods/#magic-comments), [tree shaking](https://webpack.js.org/guides/tree-shaking/), [hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/)...

### Motivation

- Webpack's config is not simple.
- There are a lot of options for different loaders and plugins as well.
- A single option may require reading a lot of documentation.
- There are issues with some loaders and plugins, due to their incomplete documentation or for some other reasons.
- There may be compatibility issues between loaders and plugins.
- Sometimes it's just too difficult to find out why something doesn't work, even the docs say it should. :D

Finding solutions to all these issues may require a lot of time and work. This tool tries to eliminate that problem.

## Basic Usage Info

Abstraction can work with the default configuration, just make sure your source dir is `<project root>/src` and your entry file is `<project root>/src/index.js`. You may need to [add more entries](#javascript). Working with a CMS has [some requirements](#cms) and needs a [server configuration](#server--).

The [default browserslist config](https://github.com/browserslist/browserslist#full-list) is being used for transpilation, polyfilling and prefixing. If you need a different browser support, configure `.browserslistrc` accordingly or delete it to build for differential serving ([module/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)).

Bundles are transpiled with [Babel (preset-env)](https://babeljs.io/docs/babel-preset-env) and can be polyfilled automatically (default) or manually, with [core-js](https://github.com/zloirock/core-js). Other polyfills should be imported manually.

For now, it works with SCSS preprocessor. CSS is prefixed with [autoprefixer](https://github.com/postcss/autoprefixer). Unused selectors are removed from CSS by default.

Nunjucks is used for templates, [a different loader can be configured](#templates--). Templates are built automatically, they should't be imported in JavaScript. If you want to import them, prefix all template filenames with an "_".

In "differential serving" mode, you **don't need** two entry points for each bundle. JavaScript will produce two bundles (ES6 and ES5) for each entry point, and CSS will be prefixed to support all browsers. Dynamic imports are not suppoorted in differential serving mode.

> NOTE:
>
> - A basic knowledge of Webpack is requried.

## Requirements

- [Node.js](https://nodejs.org/)
- NPM (comes with Node.js)
- (Optional) Editor extensions: [ESLint](https://eslint.org/docs/latest/user-guide/integrations), [Stylelint](https://github.com/stylelint/awesome-stylelint/#editor-integrations) and [Prettier](https://prettier.io/docs/en/editors.html), for a better developer experience.
- A local backend server, if you're working with a CMS

## Features

- Build and transpile JavaScript, based on `.browserslistrc` and automatically polyfill with [core-js](https://github.com/zloirock/core-js)
- Prefix CSS, remove unused selectors (logged), convert pixels to rems, sort media-queries, fix flexbox bugs
- Sourcemaps for JavaScript and CSS in development environment
- Live reload and hot module replacement
- Filenames with hashes for cachebusting in production
- Option to make a JavaScript polyfills bundle manually and conditionally import it where required
- Differential serving (module/nomodule) is configured automatically when you delete `.browserslistrc`
- Code linting and formatting config (`.editorconfig`, `.prettierrc.js`, `.eslintrc`, `.stylelintrc`)
- Info about built files, together with additional information can be found in `assets.json`, for usage with other tools or a CMS
- Work with templates (nunjucks by default), another loader can be added
- Create SVG sprites and load them automatically into HTML
- Optimise images
- Extract licenses and manually add those that are not being found during the build process
- Automatically restart the application to apply relevant config changes
- SSL for local development, if you have [mkcert](https://github.com/FiloSottile/mkcert) installed
- Develop for a CMS, with all webpack's features (a local backend domain required)

## Getting Started

### Install

```sh
npm i -D @v1ggs/abstraction
```

### Prepare linters

```sh
# Set rules for Prettier, ESLint and StyleLint
npx abs-prepare
```

### Prepare SSL

In order to use SSL (development only), you should have [mkcert](https://github.com/FiloSottile/mkcert) installed on your computer. Then create a certificate with:

```sh
npx abs-prepare-ssl
```

For a front-end project, a certificate will be created for `localhost`. If you're working in a combination with a CMS, first configure `server.backend`, then run the command. See [Server section](#server--).

When you [run](#run) the server, the certificate will be found and used automatically.

> IMPORTANT:
>
> - The certificate is created in `.cert` folder in the project's root. The folder should be automatically added to `.gitignore` and `.npmignore`, if they are found. **Please check**. If you use other "ignore" files, please add the folder manually.
>
> ___
> NOTE:
>
> - Firefox does not recognise [mkcert](https://github.com/FiloSottile/mkcert) certificate as valid.
> - If you don't use mkcert, you need to have an SSL certificate for `server.backend`.
> - If you have certificate for the backend domain, it can be used for the front-end. See [Server section](#server--) for an example how to use it.
> - You may need to redirect your local backend domain to `127.0.0.0` or `0.0.0.0` with hosts file (depends on your local server).

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
# Build files in development mode (without serving)
npx abs-build-dev
```

> NOTE:
>
> - Some optimisations and actions are not performed in development, to improve performance:
>    - Assets are not optimised or minified.
>    - Filenames don't contain hashes (cache busting).
>    - License files are not produced.
>    - Bundle Analyser file is not produced.
>    - Many other Webpack's optimizations are performed only in production.
> - Other differencies: sourcemaps are produced only in development.
> - Development bundles contain a lot of runtime code, for Webpack and devServer to work properly.
> - Falsey conditionals are not removed from code in development.

## Modes

Abstraction has two working modes:

- Build bundles using `.browserslistrc` configuration for polyfilling and prefixing
- Build two bundles for each entry, one with modern/es6 code, and the other with legacy/es5 code ([module/nomodule](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/))

### Build with `.browserslistrc`

- Configure targeted browsers in `.browserslistrc` (optional)
- [Run Abstraction the way you want](#run)

### Build for differential serving (module/nomodule)

- Delete `.browserslistrc`
- [Run Abstraction the way you want](#run)

In a front-end project, the bundles will be enqueued in HTML, so that you can test both modern and legacy bundles at the same time, one in a modern, the other in a legacy browser (even, now unsupported, IE11).

> IMPORTANT:
>
> - Dynamic imports are not supported in "differential serving" mode, but code splitting can be done with entry points, and SplitChunksPlugin will split common chunks.
>
> ___
> NOTE:
>
> - If you're using templates, this will work if your page has `<head></head>` section.
> - If you don't use templates, it's automatically configured.
> - If you're working with a CMS, enqueue both `es5` and `es6` bundles with PHP, using the information in `assets.json`. Then use `type="module"` attribute for `es6` and `nomodule defer` for `es5`.

## Config

Create `.abstraction.config.js` in the root of your project (you can find the default config [here](https://github.com/v1ggs/abstraction/blob/main/config/config.defaults.js)).

### `path = {}`

Overrides the default `src` and `dist` directories.

**`.abstraction.config.js`**

```js
module.exports = {
   // ...

   path: {
      src: './src',
      dist: './dist',
   },
};
```

### `globals = {}`

Defines global constants for usage in source code. Use the `globals: {}` object to define them. There are default constants, that will work without configuration. Eexcept for `DESIGN` and `REM_SIZE`, they can't be overriden.

Example:

**`.abstraction.config.js`**

```js
module.exports = {
   // ...

   globals: {
      MY_GLOBAL_CONST: 'something',
   },
};
```

Default constants:

```js
module.exports = {
   globals: {
      PRODUCTION: true, // `false` in development.
      PUBLIC_PATH: '/', // Autoconfigured: '/' | 'protocol://domain:port/'.
      REM_SIZE: 16, // Configured with `css.baseFontSize`.
      DESIGN: 'mobile-first', // Configured with `css.sortMQ`.
      // These are not available in SCSS:
      ENV_MAIN: true, // This is true in the modern bundle, false in the legacy.
      ENV_LEGACY: true, // This is true in the legacy bundle, false in the modern.
   },
};
```

In JavaScript and templates, you can use them the way they are declared. In SCSS, they are converted to the SCSS style: **lowercased, prefixed with `$` and underscores are converted to dashes**.

Templates example (nunjucks):

```html
{# Removes quotes from `PUBLIC_PATH` constant #}
{% set path = PUBLIC_PATH | replace('"', '') %}
<script src="{{ path }}/js/index.js"></script>
```

JavaScript example:

```js
// src/index.js
// This will be removed completely in production (when minified).
if (!PRODUCTION) {
   console.log('This is NOT production.');
}
```

SCSS example:

```scss
// src/index.scss
// Declared as `REM_SIZE: 16` in JS,
// converted to `$rem-size` in SCSS.
html {
   font-size: $rem-size + px;
}
```

> NOTE:
>
> - The default globals are declared in `.eslintrc`, under `globals`. User defined globals have to be added manually.

### `javascript = {}`

- `javascript.entry` (type: `{ <entryChunkName> string | [string] } | {}`). Configures entry points. Takes the [the original config](https://webpack.js.org/concepts/entry-points/).
- `javascript.singleRuntimeChunk` (type: `boolean`, default `false`). Adds an additional chunk containing only the runtime to each entrypoint. If you have multiple entry points on a page, set it to `true`. **Html-webpack-plugin will add all entries to HTML.**
- `javascript.polyfill` (type: `string`, default: `'auto'`, available: `'auto'`, `'manual'`). Polyfills bundles automatically. When `'manual'`, polyfills have to be imported manually.
- `javascript.providePlugin` (type: `object`). Takes [the original configuration](https://webpack.js.org/plugins/provide-plugin/). Useful if, for example, you want to [use jQuery](https://webpack.js.org/plugins/provide-plugin/#usage-jquery).

**`.abstraction.config.js`**

```js
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

Configure supported browsers in `.browserslistrc`. If you want to work the "module/nomodule" way, delete `.browserslistrc` file.

[Babel (preset-env)](https://babeljs.io/docs/babel-preset-env) is being used for transpilation and [core-js](https://github.com/zloirock/core-js) for automatic polyfilling.

[Core-js](https://github.com/zloirock/core-js) version will be automatically determined an applied to the babel config, for the latest polyfills to be available for usage.

[Terser](https://webpack.js.org/plugins/terser-webpack-plugin/) will minify code in `production` mode only.

> NOTE:
>
> - As a rule of thumb: Use exactly one entry point for each HTML document. See the issue described [here](https://bundlers.tooling.report/code-splitting/multi-entry/#webpack) for more details. **Html-webpack-plugin will add all entries to HTML.**
> - Although using multiple entry points per page is allowed in webpack, it should be avoided when possible in favor of an entry point with multiple imports: `entry: { page: ['./analytics', './app'] }`. This results in a better optimization and consistent execution order when using async script tags.

### `css = {}`

- `css.baseFontSize` (type: `number`, default: `16`). Use it to set the default font size for the project. It will be used to convert `px` to `rem`. Use it in source code as `REM_SIZE`/`$rem-size` constant. See [Globals section](#globals--).
- `css.sortMQ` (type: `string`, default: `mobile-first`, available: `mobile-first`, `desktop-first`). Defines how media queries will be grouped and sorted.
- `css.purge` (type: `object` | `false`). Set `false`, to disable purging.
- `css.purge.keepSelectors` (type: `array`). Array of selectors that should stay in CSS under any circumstances. The selectors can start with `.` or `#`, but it does not have any effect, only the name matters (matched with RegEx).

Example:

**`.abstraction.config.js`**

```js
module.exports = {
   // ...

   css: {
      baseFontSize: 16,
      sortMQ: 'desktop-first',
      purge: {
         keepSelectors: ['.selector-1', 'selector2'], // these will always stay in CSS
      },
      // purge: false, // Disable purging
   },
};
```

Import your entry `.scss` files into the corresponding JavaScript entries. For everything else (like `@import`, `@use`, fonts, images etc.) use SCSS the way you usually would. Paths should be relative to the `.scss` file where they are being imported or refered to with `url()`.

Example:

**`homepage.js`**

```js
import './homepage.scss';
```

**`homepage.scss`**

```scss
@import './header/index'; // index.scss

.class {
   background-image: url('./image.jpg'); // image in the same folder
   // or
   background-image: url('../some/path/to/image.webp'); // image from somewhere else
}
```

> NOTE:
>
> - CSS is purged by default, using [purgecss](https://github.com/FullHuman/purgecss). All removed selectors will be will be logged in a file, in `logs` folder in the project's root.
> - All templates and javascript are scanned and all found selectors will be kept.
> - Dynamic selectors created with JavaScript will not be recognised by purgecss.
> - If a CSS selector does not work in a page, purgecss may be the reason. Use `css.purge.keepSelectors` to keep it.

### `templates = {}`

By default, [simple-nunjucks-loader](https://www.npmjs.com/package/simple-nunjucks-loader) is used. Another loader can be configured.

- `templates.nunjucksOptions` (type: `object`). Takes [simple-nunjucks-loader's configuration](https://www.npmjs.com/package/simple-nunjucks-loader#options).
- `templates.customLoader` (type: `object`). Configure another templates loader. Both `fileTypes` and `use` have to be configured.
- `templates.customLoader.fileTypes` (type: `array`). Takes **an array** of file extensions (**without a leading dot**) that should be processed with the loader. It will be converted to `RegEx` and used as the Webpack's [Rule.test](https://webpack.js.org/configuration/module/#ruletest)
- `templates.customLoader.use` (type: `object`). Takes the loader's config. This value is passed to the Webpack's [`Rule.use`](https://webpack.js.org/configuration/module/#ruleuse), so you can add multiple loaders, if required.

Example for [handlebars loader](https://www.npmjs.com/package/handlebars-loader):

**`.abstraction.config.js`**

```js
module.exports = {
   // ...

   templates: {
      nunjucksOptions: {},

      customLoader: {
         fileTypes: ['hbs', 'handlebars'],
         use: ['handlebars-loader'],
      },
   },
}
```

The source folder is resolved in nunjucks config. For a different loader, this has to be configured manually . This means that you can `import`, `extend` and `include` templates and assets, relative to the **first-level subfolders** in `src`.

For example, if you have this folder structure:

```cmd
├── src
│   ├── components
│   │   ├── component1
│   │   │   ├── img
│   │   │   │   ├── image.jpg
│   │   │   │   ├── ...
│   │   │   ├── template-parts
│   │   │   │   ├── _header.njk
│   │   │   │   ├── ...
│   │   │   ├── _index.njk
│   │   ├── component2
│   │   │   ├── _index.njk
│   │   │   ├── ...
│   │   ├── ...
│   ├── homepage.njk
│ ...
```

In this example, you can include `./src/components/component1/template-parts/_header.njk` and `./src/component1/img/image.jpg` the same way in any template in the project.

Nunjucks example:

```html
<!-- This will work in:
   - src/homepage.njk
   - src/components/component1/_index.njk
   - src/components/component2/_index.njk
   or any other file. -->
{% include "component1/template-parts/_header.njk" %}
<img src="{% static 'component1/img/image.jpg' %}">
```

> IMPORTANT:
>
> - Templates are built automatically, they should't be imported in JavaScript. If you want to import them, prefix all template filenames with an "_".
>
> ___
> NOTE:
>
> - Files whose name starts with an `_` (partials) and files in a folder whose name starts with an `_` will **not** be built, **unless** they are imported in other templates.
> - If you don't use templates, a page will be automatically generated with `html-webpack-plugin`.

### `svg = {}`

#### Config

Use `svg: {}` object to configure SVG manipulation.

- **`svg.extractFrom`** (type: `array`, default: `['html', 'css']`, available: `'html'`, `'css'`, `'js'`).

Extracts SVG from HTML, CSS and JavaScript. Files from CSS and JavaScript will be extracted into sprites. Files from HTML (e.g. `<img src="{% static './svg/icon.svg' %}" alt="icon">`) will be extracted as separate files.

If not extracted, SVG will be bundled with JavaScript and url-encoded and inlined in CSS and HTML.

- **`svg.optimize: {}`** (type: `object`).

Configures optimisation, activates or deactivates `preset-default`'s plugins.

SVG is optimised with [SVGO](https://svgo.dev/) and its [preset-default](https://svgo.dev/docs/preset-default/). Available options/plugins are:

- **`svg.optimize.removeTitle`** (type: `boolean`, default: `true`). Removes the `<title>` element from the document.

> This option may have significant accessibility implications. See more [here](https://svgo.dev/docs/plugins/remove-title/).

- **`svg.optimize.removeDesc`** (type: `boolean`, default: `true`). Removes the `<desc>` element from the document.

- **`svg.optimize.removeComments`** (type: `boolean`, default: `true`). Removes XML comments from the document.

> By default, this option ignores legal comments, also known as "special comments" or "protected comments". See more [here](https://svgo.dev/docs/plugins/remove-comments/).

- **`svg.optimize.removeMetadata`** (type: `boolean`, default: `true`). Removes the `<metadata>` element from the document.

> There may be cases you'd want to disable this option, as some SVGs include copyright and licensing information in the metadata. See more [here](https://svgo.dev/docs/plugins/remove-metadata/).

- **`svg.optimize.cleanupIds`** (type: `boolean`, default: `true`). Removes unused IDs, and minifys IDs that are referenced by other elements. See more [here](https://svgo.dev/docs/plugins/cleanup-ids/).

- **`svg.optimize.removeDoctype`** (type: `boolean`, default: `true`). Removes the Document Type Definition, also known as the DOCTYPE, from the document.

- **`svg.optimize.removeViewBox`** (type: `boolean`, default: `true`). Removes the `viewBox` attribute where it matches the documents width and height.

> This option prevents SVGs from scaling, so they will not fill their parent container, or may clip if the container is too small. See more [here](https://svgo.dev/docs/plugins/remove-viewbox/).

Example:

**`.abstraction.config.js`**

```js
module.exports = {
   // ...

   svg: {
      extractFrom: ['css'],
      optimize: {
         removeTitle: true,
         removeDesc: true,
         removeComments: true,
         removeMetadata: true,
         cleanupIds: true,
         removeDoctype: true,
         removeViewBox: true,
      },
   },
}
```

#### Usage

Templates:

SVG can be included in HTML with `<img>`, `<object>` or `<iframe>`. They will be extracted as separate files, or url-encoded and inlined (see Config above). If you bundle SVG in JavaScript, they can be referenced just with their ID. See info below.

JavaScript:

Import SVG files in JavaScript.

Sprites bundled with JavaScript will be automatically injected into HTML, using [svg-sprite-loader](https://www.npmjs.com/package/svg-sprite-loader)'s browser runtime. Their filename, without extension, will be their ID. Refer to them in HTML with `<svg><use xlink:href="#id"></use></svg>`.

Example:

**`icon.js`**

```js
import icon from './svg/icon.svg';
```

**`page.html`**

```html
<svg class="icon">
   <use xlink:href="#icon"></use>
</svg>
```

If extracted from JavaScript into an external sprite, then the sprite has to be referenced in JavaScript.

Example:

```js
import icon from './svg/icon.svg';
element.innerHTML = `<svg id="${icon.id}" class="icon" ${icon.viewBox}>
      <!-- url contains id -->
      <use xlink:href="${icon.url}"></use>
   </svg>`;
```

CSS:

In SCSS use `url()`.

SCSS example:

```css
background-image: url("./svg/icon.svg");

/* will become: */

background-image: url(path/to/svg/sprite.svg#icon);
```

> IMPORTANT:
>
> - You may run into issues if the path to your project contains `#`, `%` or similar simbols, e.g. `C:\some\folder#name\project`.

### `images = {}`

- **`images.quality`** (type: `number`, default: `80`). Optimisation level, from `1` (low quality) to `100` (high quality).

Example:

```js
module.exports = {
   // ...

   images: {
      quality: 80,
   },
}
```

All images referenced in templates with `<img>`, CSS with `url()` and JavaScript with `import` will be processed. Paths to them will be properly resolved.

Resizing is not supported. All required sizes should be created manually and referenced in source files.

### `server = {}`

For a front-end project, you may not need any additional config. Webpack's devServer will serve files on `http://localhost:8080`.

If you're working with a CMS, devServer will serve files on your local backend domain, on port `8080`. Make sure it's available.

You can completely override the default devServer config in `server.devServer` object. It takes [the original config](https://webpack.js.org/configuration/dev-server/).

An example:

**`.abstraction.config.js`**

```js
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

## Polyfills

**This section needs better documentation.**

### Build polyfills for manual usage

```sh
npx abs-build-polyfills
```

## Assets.json

This file contains information about built assets, as well as some other info. This can be used with a CMS to enqueue scripts and styles that contain dynamic hashes in their filenames. When in serving mode, it can be found in the server's root, e.g. `localhost:8080/assets.json`.

## CMS

If you're working with a CMS, you need a local domain with a CMS installed.

In `.abstraction.config.js`, set `server.backend` to your local back-end domain. All Webpack's features will be available.

In development environment, enqueue built JavaScript files, for Webpack and devServer to work properly. Don't enqueuw CSS in development. Use `assets.json` for all required info. The `assets.json` file will be served by devServer, on the local backend domain (configured in `server.backend`), on port `8080` (e.g. `https://yourdomain.local:8080/assets.json`).

In production, enqueue CSS as well.

For a differential serving, enqueue both `es5` and `es6` bundles with PHP, reading information from `assets.json`. Then use `type="module"` attribute for `es6` and `nomodule defer` for `es5`.

> IMPORTANT:
>
> - devServer will use the same domain as your backend. If you need your local backend to be on a certain port, avoid using `8080`, because it's reserved for devServer. You can also override the devServer port in `server.devServer`.

## Code Quality

### Formatting

You can use [Prettier](https://prettier.io/docs/en/editors.html) editor extension, to format code. You may want to edit `.editorconfig`, `.prettierrc.js` and `.prettierignore` to fit your requirements.

> - NOTE: Formatting rules have been removed from linters.

### Linting

#### JavaScript

[ESLint](https://eslint.org/) is integrated into Webpack, with [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin), so that the code is being linted during the build process.

You can install [ESLint](https://eslint.org/docs/latest/user-guide/integrations) editor extension, to prevent mistakes before build.

> - You may want to edit `.eslintrc` to fit your requirements.

#### SCSS

[Stylelint](https://stylelint.io/) is integrated into Webpack, with [stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin), so that the code is being linted during the build process.

You can use [Stylelint](https://github.com/stylelint/awesome-stylelint/#editor-integrations) editor extension, to prevent mistakes before build.

> - You may want to edit `.stylelintrc` to fit your requirements.

### Editor integration

`.editorconfig` file configures editor and some of Prettier options.

If you're using editor extensions, then [Prettier](https://prettier.io/docs/en/editors.html) should be configured as the default code formatter.

> - Formatting rules have been removed from linters.

This is an example for VSCode:

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

## Useful Docs

- [Entry Points (Webpack)](https://webpack.js.org/concepts/entry-points/)
- [Dynamic Imports (Webpack)](https://webpack.js.org/guides/code-splitting/#dynamic-imports)
- [Prefetching/Preloading modules (Webpack)](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)
- [Lazy Loading (Webpack)](https://webpack.js.org/guides/lazy-loading/)
- [Coloring SVGs in CSS Background Images](https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images)

## Changelog

[CHANGELOG](CHANGELOG.md)

## License

[MIT](LICENSE)
