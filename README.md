![alt](./assets/Abstraction-Banner.png)

# Abstraction

> **Webpack simplified. An advanced configuration for differential serving and much more...**

- [Abstraction](#abstraction)
	- [INFO](#info)
	- [SOME FEATURES](#some-features)
	- [CODE QUALITY](#code-quality)
		- [Linting](#linting)
			- [JavaScript](#javascript)
			- [SCSS](#scss)
		- [Formatting](#formatting)
		- [Editor integration](#editor-integration)
	- [USAGE](#usage)
		- [Install:](#install)
		- [Prepare linters](#prepare-linters)
	- [CHANGELOG](#changelog)
	- [LICENSE](#license)

## INFO

> **This package is under a heavy development and may be very buggy!**
>
> **Docs are in the proces of creation...**
>
> This tool is based on Webpack and leverages its features, like code splitting, tree shaking, hot module replacement.

## SOME FEATURES

- Work with templates, nunjucks by default, another loader can be added easily in the config
- Option to develop with WordPress with webpack's HMR (a local backend domain required)
- Transpile javascript, based on .browserslistrc and automatically polyfill with core-js
- Use differential serving (module/nomodule), it is configured automatically, just remove .browserslistrc file
- Prefix and purge css, convert pixels to rems, sort media-queries, fix flexbox bugs
- Create svg sprites and load them automatically into HTML
- Optimise images
- Lint code while you're working
- Automated linters configuration for front-end or WordPress
- Automatic SSL for local development, if you have mkcert installed
- Extract and add custom licenses that are not included automatically
- Automatically restart the application on config change

## CODE QUALITY

It's recommended to use editor extensions for [ESLint](https://eslint.org/docs/latest/user-guide/integrations), [Stylelint](https://stylelint.io/) and [Prettier](https://prettier.io/docs/en/editors.html), to be able to see and fix all errors in code while your writting it.

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

```json
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

## USAGE

### Install:
```sh
npm i -D @v1ggs/abstraction
```

### Prepare linters

```sh
# Use recommended rules for ESLint (javascript) and StyleLint (scss)
npx abs-prepare-linters

# OR
# Use recommended rules for WordPress (ESLint and StyleLint)
npx abs-prepare-linters-wp
```

## CHANGELOG

[CHANGELOG](CHANGELOG.md)

## LICENSE

[MIT](LICENSE)
