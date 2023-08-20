# Changelog

## [0.5.2](https://github.com/v1ggs/abstraction/compare/0.5.1...0.5.2) (2023-08-20)


### Docs

* improved banner for dark backgrounds and replaced png with svg ([6d23080](https://github.com/v1ggs/abstraction/commit/6d23080d8cc87b5d4b3588bb3dca61358bc849ac))
* updated to reflect latest changes, added more info ([d134849](https://github.com/v1ggs/abstraction/commit/d13484951d1f9e14a98d5e1d08d9b1cbb740a9e1))

## [0.5.1](https://github.com/v1ggs/abstraction/compare/0.5.0...0.5.1) (2023-08-03)


### Bug Fixes

* fixed "multiple entries on page" info and differentialBuildConfig ([5cec361](https://github.com/v1ggs/abstraction/commit/5cec36176c9f78fc9dd0a61f57f941a5aebbb032))
* fixed and reorganised "prepare" scripts, fixed eslint config for wordpress ([e6d95c1](https://github.com/v1ggs/abstraction/commit/e6d95c1dbdfc9f5447cee703051aebf67c084a09))
* fixed nodemon watcher ([0ca3adf](https://github.com/v1ggs/abstraction/commit/0ca3adf6e9698495a54b8dcfe7ac8170da92d538))
* removed "self-exec" from functions in utils/abstraction.js ([a82e94c](https://github.com/v1ggs/abstraction/commit/a82e94caaf43d5ea1ea6fbc4b42f76d82f37c8e3))
* renamed .gitignore, because it wasn't uploaded to npm and removed ds-tpl.ejs template ([2466556](https://github.com/v1ggs/abstraction/commit/24665562f366d234765ea0b3d343f593e1bc5cde))

## [0.5.0](https://github.com/v1ggs/abstraction/compare/0.4.0...0.5.0) (2023-08-01)


### Features

* added binaries for esasier usage ([0a0c99e](https://github.com/v1ggs/abstraction/commit/0a0c99effa7a3e5310326ffe594c22e99bc2fddb))
* added binaries to prepare linters in console easier ([0b7946f](https://github.com/v1ggs/abstraction/commit/0b7946fe70d852c4e570809ed812e9e7efa446ac))
* added option to create basic src files ([66ae52a](https://github.com/v1ggs/abstraction/commit/66ae52a2cd58424722a060a7a40e5c2c5efbc8ba))
* added public path when wp theme is not at the default location ([2fc8dab](https://github.com/v1ggs/abstraction/commit/2fc8dabf77ff1f11503986b4974086e8858bccdd))
* now automatically creating entry points ([d198a19](https://github.com/v1ggs/abstraction/commit/d198a19064b6bfce1260fdcbb1e05c8537e635ef))
* removed `diffServeLoader` var in templates, now activated automatically, if required (br.chng) ([dce8a94](https://github.com/v1ggs/abstraction/commit/dce8a9487ec2c9e7e0f1e36678fa84daee89ff78))


### Bug Fixes

* fixed core-js detection ([3b940b8](https://github.com/v1ggs/abstraction/commit/3b940b8d66e45d1216b4228085c089ab578f6f92))
* fixed issue with assets webpack plugin, could not create the file on build ([20efc77](https://github.com/v1ggs/abstraction/commit/20efc77604e96d2649fe72b1d1f64edc2d56cce3))
* fixed problem when user config file was missing ([bd9e5b5](https://github.com/v1ggs/abstraction/commit/bd9e5b570e0973de91dbb70836fc83758e4180d9))


### Docs

* updated docs to reflect recent changes and added banner ([14f250a](https://github.com/v1ggs/abstraction/commit/14f250a6db88eba8955da8d51af5d65103c5c39d))
* updated docs, because of php-related config removal ([e0e3343](https://github.com/v1ggs/abstraction/commit/e0e3343942a9614f9a3ff6fbbd879bee7ccdbf77))

## [0.4.0](https://github.com/v1ggs/abstraction/compare/0.3.0...0.4.0) (2023-07-28)


### Features

* added "lint" and "fix" scripts ([1572e17](https://github.com/v1ggs/abstraction/commit/1572e176696c4d8293519e5c258e14acb791c56f))
* added linting scripts, fixed and improved linters auto-config ([124cba4](https://github.com/v1ggs/abstraction/commit/124cba41a6b5c1c2b70b6c050a03617b8bcfaaa5))


### Docs

* added "code quality" section, still to be edited ([5fc724c](https://github.com/v1ggs/abstraction/commit/5fc724cb14865ebeda19927f139da29c0a9a9c25))

## [0.3.0](https://github.com/v1ggs/abstraction/compare/0.2.0...0.3.0) (2023-07-27)


### Features

* copy other files on start-up ([ebc7758](https://github.com/v1ggs/abstraction/commit/ebc775833fe2281562073776f68df826d9b43d7d))
* renamed and moved global vars (actually a fix, but a breaking change as well) ([430df8f](https://github.com/v1ggs/abstraction/commit/430df8f27c5552e6245a9ab89a8a3088f2ae6357))


### Bug Fixes

* fixed logging, locked minor versions for installed pkgs, fixed rc files, downgraded some pkgs ([9ee631d](https://github.com/v1ggs/abstraction/commit/9ee631d32543d7c17c26eab08012f83ab0a202ab))
* manually incremented minor ver, lint config as devDeps, added lint scripts ([3c0fb58](https://github.com/v1ggs/abstraction/commit/3c0fb585b666aec59f4a905d667fba30d388683b))


### Docs

* added table of contents, changelog and license links ([f5a0d95](https://github.com/v1ggs/abstraction/commit/f5a0d9551b2d7cd143a96c25ecebe84460b4754c))

## [0.2.0](https://github.com/v1ggs/abstraction/compare/0.1.1...0.2.0) (2023-07-26)


### Features

* added @v1ggs/abstraction-dsl ([23de6df](https://github.com/v1ggs/abstraction/commit/23de6dfa4e3d5a8610fe670879b8022cf873d428))
* automatic linters setup ([abd58a0](https://github.com/v1ggs/abstraction/commit/abd58a070298f31d253b1fe254cafd0eb15b34da))


### Bug Fixes

* fixed issue when the user config file was missing ([f7d18fa](https://github.com/v1ggs/abstraction/commit/f7d18fa8c5677c9bdc2e9319f43006424de9a86b))

## [0.1.1](https://github.com/v1ggs/abstraction/compare/0.1.0...0.1.1) (2023-07-24)


### Docs

* minor change ([77a62b0](https://github.com/v1ggs/abstraction/commit/77a62b069624d2115af5662f52909b1e80363be8))

## [0.1.0](https://github.com/v1ggs/abstraction/compare/0.0.0...0.1.0) (2023-07-24)


### Features

* config to prepare lint/format configuration files ([7136d81](https://github.com/v1ggs/abstraction/commit/7136d8193f183d0c891cb1c56c31a7bc42225e6a))
* created files for lint/format configuration ([5a1cf73](https://github.com/v1ggs/abstraction/commit/5a1cf734f2074d75248a0388d168fc89a6d3db49))
* instead of src/licenses.txt, now src/licenses dir with additional licenses (breaking change) ([23602a0](https://github.com/v1ggs/abstraction/commit/23602a006b05122cded7de937bd6ead7b88664c2))


### Bug Fixes

* changed an incorrect path to plugins ([0b60b8a](https://github.com/v1ggs/abstraction/commit/0b60b8a500498f50ad7a914a2b964c8d7a86a743))
* fixed exec script ([7b79370](https://github.com/v1ggs/abstraction/commit/7b793703c7f1e6e41eff3782ac966e20296bc07b))
* fixed issue with copy plugin, when the copy dir was absent or empty ([5bb9b24](https://github.com/v1ggs/abstraction/commit/5bb9b24528388c1e8aaec2331d56e5209c1a4896))
* removed index file and linked "main" directly to the webpack config file ([0b1bb5c](https://github.com/v1ggs/abstraction/commit/0b1bb5c6b8cf1ed8dbf4cebd5b8ac24be1a8b782))


### Docs

* added info on lint/format files ([30d1914](https://github.com/v1ggs/abstraction/commit/30d1914996424279483f0653f3df3807f6519add))

## 0.0.0 (2023-07-23)