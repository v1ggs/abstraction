# Abstraction

> Webpack simplified. An advanced configuration for differential serving and much more...

- [Abstraction](#abstraction)
	- [INFO](#info)
	- [CODE QUALITY](#code-quality)
		- [Linting](#linting)
			- [SCSS](#scss)
			- [JavaScript](#javascript)
		- [Formatting](#formatting)
		- [Editor integration](#editor-integration)
			- [JavaScript and Sass](#javascript-and-sass)
			- [PHP](#php)
	- [CHANGELOG](#changelog)
	- [LICENSE](#license)

## INFO

- This package is under development and probably very buggy.
- Must be installed
- Not on NPM yet

**Docs are in the proces of creation...**

## CODE QUALITY

It's recommended to use editor extensions for [ESLint](https://eslint.org/docs/latest/user-guide/integrations), [Stylelint](https://stylelint.io/), [PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) and [Prettier](https://prettier.io/docs/en/editors.html), to be able to see and fix all errors in code while your writting it.

### Linting

ESLint and Stylelint are integrated into Webpack, with [eslint-webpack-plugin](https://www.npmjs.com/package/eslint-webpack-plugin) and [stylelint-webpack-plugin](https://www.npmjs.com/package/stylelint-webpack-plugin), so that the code is being linted during the build process.

For PHP, there is a [Composer](https://getcomposer.org/) script, that can be run manually, and it runs automatically, when building files for production. Thats' why an editor extension is recommended.

To run it manually, type in console:

```sh
composer lint
```

Configuration files `.eslintrc`, `.stylelintrc` and `.phpcs.xml.dist`, found in the root directory, are being used to configure linters for JavaScript ([ESLint](https://eslint.org/docs/latest/user-guide/integrations)), SCSS ([Stylelint](https://stylelint.io/)) and PHP ([PHPCS](https://github.com/squizlabs/PHP_CodeSniffer)). They are configured automatically, but you can change them to fit your requirements.

#### SCSS

StyleLint rule `"extends": [ "stylelint-config-prettier" ]` turns off stylelint's code style (formatting) rules. This means StyleLint will not display formatting errors in the editor: it will help you write a correct code and warn you about any problems, and [Prettier](https://prettier.io/docs/en/editors.html) will take care of formatting.

In StyleLint v15, formatting rules have been removed, and `stylelint-config-prettier` is not longer required, but StyleLint config for WordPress does not yet work with it, so version 14 is being used for now.

#### JavaScript

It's the same with ESLint's `eslint-config-prettier`, or just `"extends": [ "prettier" ]` in `.eslintrc` file.

### Formatting

Configuration files `.prettierrc.js` and `.phpcs.xml.dist` are being used to configure code formatters for JavaScript and SCSS ([Prettier](https://prettier.io/docs/en/editors.html)), and PHP ([PHPCS](https://github.com/squizlabs/PHP_CodeSniffer)). They are configured automatically, but you can change them to fit your requirements.

### Editor integration

#### JavaScript and Sass

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

#### PHP

[PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) Should be set as the default linter, and formatter.

For VSCode it should look like this:

```json
{
	"[php]": {
		// "editor.formatOnSave": true,
		"editor.defaultFormatter": "wongjn.php-sniffer",
	},
	// Disables VSCode's default php features.
	"php.suggest.basic": false,
	"php.validate.enable": false,
	// Uncomment and configure the next line if PHP (php.exe) is not in PATH.
	// "php.validate.executablePath": "C:\\xampp\\php\\php.exe",
	"phpSniffer.run": "onType",
	"phpSniffer.onTypeDelay": 500, // optional, configure to fit your needs
	// auto-detect phpSniffer.executablesFolder as ./vendor/bin/ per workspace
	// folder (applies only if phpSniffer.executablesFolder is empty).
	"phpSniffer.autoDetect": true,
}
```

and VSCode extension is [PHP Sniffer](https://marketplace.visualstudio.com/items?itemName=wongjn.php-sniffer).

## CHANGELOG

[CHANGELOG](CHANGELOG.md)

## LICENSE

[MIT](LICENSE)
