// BABEL LOADER - LEGACY BUNDLE CONFIG

const path = require('path');
const { cloneDeep } = require('../../utils/js');
const { paths } = require('../../utils/get-paths');
const babelCache = path.join(paths.BABELCACHE, 'es5');
const { babelLoaderES6, babelPresetEnv } = require('./babel-modern');

const babelLoaderES5 = cloneDeep(babelLoaderES6);
const babelPresetEnvES5 = cloneDeep(babelPresetEnv);

// https://github.com/browserslist/browserslist#browsers
// When no targets are specified: Babel will assume you are targeting
// the oldest browsers possible. For example, @babel/preset-env will
// transform all ES2015-ES2020 code to be ES5 compatible.
// Because of this, Babel's behavior is different than browserslist:
// it does not use the defaults query when there are no targets are
// found in your Babel or browserslist config(s).
// **********************************************************************
// We recognize this isn’t ideal and will be revisiting this in Babel v8.
// **********************************************************************
babelPresetEnvES5[1].targets = {};

// Enable this option if you want to force running all transforms,
// which is useful if the output will be run through UglifyJS or
// an environment that only supports ES5.
babelPresetEnvES5[1].forceAllTransforms = true;

// For some reason preset-env ignores ignoreBrowserslistConfig: true, even in a
// config file. If .browserlistrc is found, it will be merged with this config.
babelPresetEnvES5[1].ignoreBrowserslistConfig = true;

// babelLoaderES5.use.options = {};
babelLoaderES5.use.options.browserslistConfigFile = false;
babelLoaderES5.use.options.cacheDirectory = babelCache;
babelLoaderES5.use.options.presets = [babelPresetEnvES5];

module.exports = babelLoaderES5;
