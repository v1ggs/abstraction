# Changelog

## [0.8.0](https://github.com/v1ggs/abstraction/compare/0.7.0...0.8.0) (2024-03-10)


### Features

* add option to rename  assets json file ([de3da8a](https://github.com/v1ggs/abstraction/commit/de3da8a6000e60463126017b27643ace78054b18))


### Bug Fixes

* always write json to disk, for assets plugin to not break when serving ([6605efb](https://github.com/v1ggs/abstraction/commit/6605efb119714f61b3a1cda87dcc538753df8f2f))
* console logging error introduced in a previous commit ([3b10708](https://github.com/v1ggs/abstraction/commit/3b1070850a853f3de5480a1a81640d864fda6712))
* don't overwrite config files when copying ([5f8237c](https://github.com/v1ggs/abstraction/commit/5f8237cea22c7330533534f802777765cc4f117b))
* prevent deleting built legacy files in development (in differential serving mode) ([33c819b](https://github.com/v1ggs/abstraction/commit/33c819b2653c85b951812ec0ee1deecfacd81751))
* reported http protocol in assets json ([b754240](https://github.com/v1ggs/abstraction/commit/b7542405cf3a754d7bd02c08fab5592bf74e7143))


### Docs

* minor update and fixes ([f1afc43](https://github.com/v1ggs/abstraction/commit/f1afc43ece4e5d8f05cc607878136174caed2e30))


### Refactor

* minor changes ([ceeb997](https://github.com/v1ggs/abstraction/commit/ceeb997bc1e2caa1d2dc320de72e8acc327923b5))
* rename assets json file (breaking change) ([c4ad1c3](https://github.com/v1ggs/abstraction/commit/c4ad1c3f0e2c8dc1c1eecfc88ee5204f6b8ccf8b))
* replace abstraction-dsl with ajax ([3d195e3](https://github.com/v1ggs/abstraction/commit/3d195e34f3a4f98fed8ac071a9e5ddc866ef169a))


### Chore

* add npm ignore ([69b8b73](https://github.com/v1ggs/abstraction/commit/69b8b7361bbc1346170cb4d38e3c6c686f97b889))
* update config files ([b2a9fa3](https://github.com/v1ggs/abstraction/commit/b2a9fa3ceffc14ac90a68cc4bdc1d0a3e25f5dfd))
* update dependencies (breaking change: support >= node 18.12) ([04a3dbd](https://github.com/v1ggs/abstraction/commit/04a3dbd3d8638196a65ce511a66947ed20c12d46))

## [0.7.0](https://github.com/v1ggs/abstraction/compare/0.6.0...0.7.0) (2023-12-31)


### Features

* add more control to svg optimisation (breaking change: now under svg options) ([199147e](https://github.com/v1ggs/abstraction/commit/199147ef3e4e6ee69b0753d3eb47259852e721d1))
* add project name to .assets.json metadata and reorganize it (br. change) ([fecf9cc](https://github.com/v1ggs/abstraction/commit/fecf9cccb14dc837aea35a55e7dbf179e66258eb))
* option to extract/bundle/inline svg in css or js ([f1a7635](https://github.com/v1ggs/abstraction/commit/f1a7635a3240594928a901675dc4315c415058dd))
* process documents, like pdf, docx etc ([f011c62](https://github.com/v1ggs/abstraction/commit/f011c6273b499c1b61e2292d95611c66af3c5aff))
* process svg in templates ([11c9247](https://github.com/v1ggs/abstraction/commit/11c9247a3fb9af5b72fb30212d5f166c1f872b0a))


### Bug Fixes

* add dedicated publicPath for processed assets ([5198915](https://github.com/v1ggs/abstraction/commit/5198915f364a65f848ba7cf957b3602e802b7192))
* add splitChunks plugin ([4cfa5b4](https://github.com/v1ggs/abstraction/commit/4cfa5b4f112349e4490f481493698293fc117a2d))
* asset filenames ([de1f014](https://github.com/v1ggs/abstraction/commit/de1f01466b27fe0ba72a259390b1b84f4c4fe73d))
* build all found templates in src and exclude _ prefixed dirs ([22e9c4b](https://github.com/v1ggs/abstraction/commit/22e9c4b07ed0f56e4ddcda1540175116f959b19f))
* change webpack publicPath to "auto" ([cb4d29b](https://github.com/v1ggs/abstraction/commit/cb4d29bcb93c416adb30d2ee97eeb9aba27def02))
* **devserver:** fix breaking on errors in templates ([b8f0393](https://github.com/v1ggs/abstraction/commit/b8f0393e322f55038b06ac75be5d3215300ee3e5))
* don't clean dist when serving in production ([cb60f2b](https://github.com/v1ggs/abstraction/commit/cb60f2b6308e289a8eb68852450a1fa8ba3b2b99))
* don't resolve src subfolders, to prevent issues with nunjucks ([a07131f](https://github.com/v1ggs/abstraction/commit/a07131f8a2c2aa7cbf7404a4bf409450327080a5))
* postcss-reporter ([1490517](https://github.com/v1ggs/abstraction/commit/1490517a9efe2b9a38f6f234ad72b16408e8c556))
* produce sprites for svg files referenced in CSS with url() ([35b227f](https://github.com/v1ggs/abstraction/commit/35b227fd5ab897f2f736a9e91d3c80812272da7a))
* svg optimisation ([d45510f](https://github.com/v1ggs/abstraction/commit/d45510fb1981d597e801e8a2959c98db9ff0fe0c))
* use devServer's default hmr setting ([29c2243](https://github.com/v1ggs/abstraction/commit/29c2243b0ccdf7d3656bd4154561f13bad8d8f90))


### Docs

* banner's text to path, for cross-platform consistency ([54bb424](https://github.com/v1ggs/abstraction/commit/54bb424f7109dad2f6e19d69cb1efd509b2a81e8))
* fix mistakes and code indentation ([24cb75d](https://github.com/v1ggs/abstraction/commit/24cb75da325a10059e20734c9942ec4ac9b16322))
* update docs ([16c79ec](https://github.com/v1ggs/abstraction/commit/16c79eca528f5f6ce668a3df3276d7837dd66955))


### Refactor

* mini css extract plugin publicPath ([d1a3ab1](https://github.com/v1ggs/abstraction/commit/d1a3ab1fe22925d1db952a145b2f377dc5b2f50f))


### Performance

* add wordpress to devserver watcher excludes ([2848e4f](https://github.com/v1ggs/abstraction/commit/2848e4ff4d7d62cf67cb01de5e61dcade3822d24))
* don't hash assets in development ([e268f24](https://github.com/v1ggs/abstraction/commit/e268f24c0f020137716b9679b385ba2e7c415c37))
* don't minify images in development ([b336f12](https://github.com/v1ggs/abstraction/commit/b336f1249526ef09b31f378d9affbcd9c02ae22e))


### Chore

* add src files for development purposes ([41de55a](https://github.com/v1ggs/abstraction/commit/41de55ae3dd826d0499591016d7aa97c579768d7))
* exclude this package from licenses ([0a577fc](https://github.com/v1ggs/abstraction/commit/0a577fca91cb3c4c4251df73650c05332fe956b5))
* extract css when serving in production ([bbdf641](https://github.com/v1ggs/abstraction/commit/bbdf641fc3c868fd3025353151a151c4f5de8bf4))
* **nunjucks:** remove static tag creator as redundant ([7bb310f](https://github.com/v1ggs/abstraction/commit/7bb310fbf6aa717c68bf94caba7e95b04347e277))
* remove asset size warnings in development ([f4413b6](https://github.com/v1ggs/abstraction/commit/f4413b65277ea8846b3617c101ca69640997052d))
* turn of multiple entry info on run ([92052ec](https://github.com/v1ggs/abstraction/commit/92052ec06fc578f4125a05cad8da04d96127abe8))

## [0.6.0](https://github.com/v1ggs/abstraction/compare/0.5.2...0.6.0) (2023-12-16)


### Features

* add project version to .assets.json ([1139c2d](https://github.com/v1ggs/abstraction/commit/1139c2d031abed95d9fc536350685ace4c8b1d73))
* automatic public path for development for a CMS ([a6d5684](https://github.com/v1ggs/abstraction/commit/a6d568473c7ad23e7b0702471ce3d5acd074b73a))
* make an ssl certificate with npx abs-prepare-ssl ([6b59d78](https://github.com/v1ggs/abstraction/commit/6b59d786749e1afd30b365371b67660b82a2ee68))
* option to configure src and dist dirs ([79b8e3d](https://github.com/v1ggs/abstraction/commit/79b8e3d0c9f602e7b74913e699c54c8970154643))
* when serving, serve .assets.json with cms, themeDIrName is projectDirname now ([e264dc5](https://github.com/v1ggs/abstraction/commit/e264dc5a74d2161cb64347732926ab1912f4d29f))


### Bug Fixes

* **assets plugin:** now webpack keeps .assets.json, when cleans dist in production ([555d124](https://github.com/v1ggs/abstraction/commit/555d1248cd113926c58e3b8aae8fee9e1251fd5d))
* changed the way nodemon works to get webapack's log in console ([433a4fb](https://github.com/v1ggs/abstraction/commit/433a4fb0f09828bc3eff46446ec4f812c66a19e1))
* don't produce polyfills for the entire webpack entry object ([b7a4866](https://github.com/v1ggs/abstraction/commit/b7a4866b80698f00db84551399bfdf9280242faa))
* license banner is now created for both modern and legacy bundles ([acab0ff](https://github.com/v1ggs/abstraction/commit/acab0ff0ba3144f90e106ee540dfc4ee1e6196c2))
* make global variables available for usage in source code ([ff0831d](https://github.com/v1ggs/abstraction/commit/ff0831df49176a746602c191f96226b2c73715b9))
* output extension for templates, remove console logs ([667f64b](https://github.com/v1ggs/abstraction/commit/667f64bc16e745d99b40555792c64baf9ce9fea5))
* sass module fixes: ([f0b2599](https://github.com/v1ggs/abstraction/commit/f0b259935dfd046dd7b478c6ad0880b22ba1dcd7))
* start (serving) time in console ([e7b1563](https://github.com/v1ggs/abstraction/commit/e7b15639dfde4b1b233f75b4e21e1a5a1b5b8fc6))
* **templates:** use proper functions ([ae778e6](https://github.com/v1ggs/abstraction/commit/ae778e6b4723aff387e3a8dfe1ad62b083574d2f))
* update @v1ggs/abstraction-dsl to support IE11 ([86f92cd](https://github.com/v1ggs/abstraction/commit/86f92cdedc7866b7609cbdb44a7ee0861caebc57))
* use devServer config (error introduced in 433a4fb) ([3c9f526](https://github.com/v1ggs/abstraction/commit/3c9f52606ace6482b1efefc6bfe8c7d90651ac7c))
* use nunjucks "preloader" ([38e5b47](https://github.com/v1ggs/abstraction/commit/38e5b47ccee87c23eb580fb9fcabdd33acb8aa78))
* use templates loader when no templates found ([dee8aa6](https://github.com/v1ggs/abstraction/commit/dee8aa67c9f1111183a67a433ad83e8295b344c1))
* watch templates with devServer for page reloads on save ([7377312](https://github.com/v1ggs/abstraction/commit/7377312f65b5e245de4a4af2dc3329b5ae9e4f64))


### Docs

* add more information ([87235fb](https://github.com/v1ggs/abstraction/commit/87235fb3494fddf6c885a22bf2cc8d7aad7a90df))


### Refactor

* fs helpers ([14cba75](https://github.com/v1ggs/abstraction/commit/14cba75937fad32a05b9982132db7aa45d986667))
* get config and filetypes ([22540d4](https://github.com/v1ggs/abstraction/commit/22540d4fd4c13269883cf0210b42f73cc99a9265))
* js helpers ([aa783b9](https://github.com/v1ggs/abstraction/commit/aa783b96358dd2898617badb9a64241ac4254954))
* mkcert ([743180c](https://github.com/v1ggs/abstraction/commit/743180c0ed8a3f8f9dcfa6dbc6573dba765663f1))
* mofiy/remove console logs ([d921e29](https://github.com/v1ggs/abstraction/commit/d921e2961d2dc9ca826fa635e95a4b74c7df7fa4))
* move and refactor config helpers ([4a4f97c](https://github.com/v1ggs/abstraction/commit/4a4f97c4b21659e53c01969d81d16db93fdd3d97))
* move globals config to get-config, to avoid issues with circular dependencies ([596a57d](https://github.com/v1ggs/abstraction/commit/596a57d4ccf3c1fe8ee71db5dab531ca2852a567))
* move paths config to get-config, to avoid issues with circular dependencies ([8bf02b0](https://github.com/v1ggs/abstraction/commit/8bf02b043dda567a0508a43348d0c74b61e18d9f))
* server configs ([086e173](https://github.com/v1ggs/abstraction/commit/086e1739fd7b28360855b0367bb87beb5445ff0d))


### Performance

* remove browsersync, use devserver w/o backend proxy ([a892697](https://github.com/v1ggs/abstraction/commit/a892697221e51e75337d92261457163a6000941f))


### Chore

* added files for npm scripts, for usage when developing abstraction ([34c5c47](https://github.com/v1ggs/abstraction/commit/34c5c47ce5d2a08fe623c45bfeb54c80bd7ceacd))
* added more commit message types to changelog, when releasing ([3dfcbdb](https://github.com/v1ggs/abstraction/commit/3dfcbdb142efa2e8c08c4c22fd621471afd30806))
* added scritps for usage in development ([a41db2d](https://github.com/v1ggs/abstraction/commit/a41db2d137d2f202024a98f903add6959d4a84d8))
* change npm scripts for develoment purposes ([a35afeb](https://github.com/v1ggs/abstraction/commit/a35afebc9b9863e5f337bb38deb72a942c264fe1))
* changed prepare script behaviour ([124ef43](https://github.com/v1ggs/abstraction/commit/124ef4302a1c9de021ae9ca561eee8eebb34e953))
* css.px2rem is now css.baseFontSize (breaking change) ([a291eb9](https://github.com/v1ggs/abstraction/commit/a291eb9313089f0994c32c0029111cb3125c3d4b))
* fixed a typo in a console log ([eb83b89](https://github.com/v1ggs/abstraction/commit/eb83b896b6017ee3681c8b2c5a90ad879db47a81))
* moved all files from config/node to bin ([bc59bcd](https://github.com/v1ggs/abstraction/commit/bc59bcd9d6f164ed6625c4e36f7a58ebe612c273))
* reinstall packages ([797288a](https://github.com/v1ggs/abstraction/commit/797288aaa38a0c8dd1b869ba51c6facd993aff82))
* removed shelljs dependency ([e6f24fc](https://github.com/v1ggs/abstraction/commit/e6f24fc4021dc8e8e75b7f8cdec935dc1a272d4b))
* rename cli commands ([88784fb](https://github.com/v1ggs/abstraction/commit/88784fb6083e6faf901f837c67824ac7082d438f))
* reorganised dependencies ([fae62fc](https://github.com/v1ggs/abstraction/commit/fae62fcf5492b14e14e4aaa52639a78cc1797371))
* update dot-files ([abc958b](https://github.com/v1ggs/abstraction/commit/abc958b6b17a25d4e311d1288990d7d426e17b93))

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
