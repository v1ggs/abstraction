const fs = require('fs');
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const { fixPathForGlob } = require('./js');
const { config } = require('./get-config');
const server = require('../utils/get-config-server');
const AssetsPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackLicensePlugin = require('webpack-license-plugin');
const WebpackProgressPlugin = require('progress-webpack-plugin');
const {
   isServing,
   projectInfo,
   differentialBuildConfig,
} = require('./abstraction');

const timestamp = Date.now();
const isDifferentialBuild = differentialBuildConfig();
const projInfo = projectInfo();

// const RemoveEmptyScripts = require( 'webpack-remove-empty-scripts' );
// const WebpackShellPluginNext = require('webpack-shell-plugin-next');
// https://www.npmjs.com/package/webpack-remove-empty-scripts
// exports.RemoveEmptyScriptsPlugin = () => new RemoveEmptyScripts();

// Prevents unexpectedly changing hashes.
// This plugin will cause hashes to be based on the relative path of the module,
// generating a four character string as the module id. Suggested for use in production.
// https://webpack.js.org/plugins/hashed-module-ids-plugin/
exports.HashedModuleIdsPlugin = () => {
   return new webpack.ids.HashedModuleIdsPlugin({
      // - context: The context directory (absolute path) for creating names.
      // - hashFunction: The hashing algorithm to use, defaults to 'md4'.
      //   All functions from Node.JS' crypto.createHash are supported.
      // - hashDigest: The encoding to use when generating the hash, defaults to 'base64'.
      //   All encodings from Node.JS' hash.digest are supported.
      // - hashDigestLength: The prefix length of the hash digest to use, defaults to 4.
      //   Note that some generated ids might be longer than specified here, to avoid module id collisions.
      hashDigestLength: 10,
   });
};

// Automatically load modules instead of having to import or require them everywhere.
// https://webpack.js.org/plugins/provide-plugin/
exports.ProvidePlugin = options => new webpack.ProvidePlugin(options);

// Defines globals for usage in the source code.
// https://webpack.js.org/plugins/define-plugin/
exports.DefinePlugin = options => new webpack.DefinePlugin(options);

// Removes imported/required files from an entry.
// Takes a regex. An example: /\.(sa|sc|c)ss$/
// https://webpack.js.org/plugins/ignore-plugin/
exports.IgnoreFileTypes = regex => {
   return new webpack.IgnorePlugin({
      resourceRegExp: regex,
      contextRegExp: /src$/,
   });
};

// Webpack generates a js file for each resource defined in Webpack entry.
// The mini-css-extract-plugin extract CSS, but not eliminates a generated empty js file.
// This plugin removes unexpected empty js file.
// https://www.npmjs.com/package/webpack-remove-empty-scripts
// exports.RemoveEmptyScriptsPlugin = () => {
// 	return new removeEmptyScriptsPlugin();
// };

// Elegant ProgressBar and Profiler for Webpack
// https://www.npmjs.com/package/webpackbar
// exports.WebpackBar = (options) => new webpackbar(options);

// https://www.npmjs.com/package/progress-webpack-plugin
exports.ProgressPlugin = identifier =>
   new WebpackProgressPlugin({
      minimal: true,
      identifier: identifier,
      onStart: () => {
         console.log('');
      },
      // onFinish: () => {
      //    console.log('');
      // },
   });

/**
 * @see https://www.npmjs.com/package/string-replace-loader
 *
 * Finds all `core-js` polyfills imported by babel,
 * removes them from code and exports them in a file.
 * Used in a separate process, to only produce polyfills,
 * based on the code and the targeted browsers.
 *
 * @param {filename} string - processed bundle name
 * @return {Object} string-replace-loader config
 */
exports.exportPolyfills = filename => {
   const file = path.resolve(
      config.paths.POLYFILLS,
      filename + '-polyfills.js',
   );

   // regex pattern to find `import "core-js/modules/**/*.js";`
   const regexPattern = /import\s*?["']core-js[/\\]modules[/\\].*?\.js["'];?/gi;

   if (!fs.existsSync(config.paths.POLYFILLS)) {
      fs.mkdirSync(config.paths.POLYFILLS, { recursive: true });
   }

   // Overwrite existing files first, then append data.
   fs.writeFileSync(file, `// polyfills required for ${filename}\n`);

   return {
      // search in all files
      // test: /\.js$/,

      loader: 'string-replace-loader',

      options: {
         search: regexPattern,

         // eslint-disable-next-line
         replace(match, p1, offset, string) {
            // console.log(`Replacing "${match}" in file "${this.resource}" with "${p1}".`);

            fs.appendFileSync(file, match + '\n', 'utf8');

            // remove all
            return '';
         },

         // flags: 'gmi',
      },

      // For multiple replacements create multiple search/replace objects
      // options: {
      //    multiple: [{}, {}],
      // },
   };
};

// `license-webpack-plugin` did not get all packages.
// Terser only extracts a license comment, if finds it in a file.
// This plugin uses a deprecated option, so I'm running:
// `node --no-deprecation node_modules/webpack/bin/webpack.js`.
// Replace this only with `webpack`, once this gets fixed.
// https://www.npmjs.com/package/webpack-license-plugin
exports.WebpackLicensePlugin = filename => {
   const outputFilename = config.paths.DIST.javascript + '/' + filename;

   const options = {
      outputFilename: outputFilename + '.json',

      includePackages: () => {
         return config.licenses.include.map(pkg => {
            return path.resolve(config.paths.ROOT, 'node_modules', pkg);
         });
      },

      excludedPackageTest: (packageName /*, version */) => {
         // The previous plugin also captured nunjucks...
         const excludes = [
            'nunjucks',
            'simple-nunjucks-loader',
            'svg-baker-runtime',
            'svg-sprite-loader',
            'html-webpack-plugin',
            '@v1ggs/abstraction',
            '@v1ggs/abstraction-dsl',
         ].concat(config.licenses.exclude);

         return excludes.includes(packageName);
      },

      unacceptableLicenseTest: licenseIdentifier => {
         return config.licenses.unacceptable.includes(licenseIdentifier);
      },

      // configured below
      additionalFiles: {},
   };

   options.additionalFiles[`${outputFilename}.txt`] = packages => {
      const licensesSeparator =
         '========================================' +
         '========================================' +
         '\n\n\n\n';

      const additionalLicenseDir = fixPathForGlob(
         path.resolve(config.paths.SRC.path, 'licenses'),
      );

      const additionalLicenses = glob
         .sync(additionalLicenseDir + '/**/*')
         .map(file => {
            if (fs.lstatSync(file).isFile()) {
               return fs.readFileSync(file, 'utf8') + licensesSeparator;
            }
         })
         .join('');

      // Get an array of objects, for found packages.
      const content = Object.keys(packages).map(pkg => {
         return (
            // Get an array of `package.json` properties for each file.
            Object.keys(packages[pkg])
               .map(property => {
                  // Avoids printing `"some-property": null`
                  if (!packages[pkg][property]) {
                     return property + ':';
                  }

                  return property + ': ' + packages[pkg][property];
               })
               .join('\n')
               // add new line below the last property
               .concat('\n')
         );
      });

      return content.concat(additionalLicenses).join(licensesSeparator);
   };

   return new WebpackLicensePlugin(options);
};

// https://webpack.js.org/plugins/banner-plugin/
exports.BannerPlugin = banner =>
   new webpack.BannerPlugin({
      // Configure terser to keep this
      banner: banner,
   });

// https://www.npmjs.com/package/copy-webpack-plugin
// Returns array
exports.CopyPlugin = () => {
   const copyDir = fixPathForGlob(path.resolve(config.paths.SRC.path, 'copy'));
   const files = glob.sync(copyDir + '/**/*');

   if (fs.existsSync(copyDir) && files.length) {
      return [
         new CopyWebpackPlugin({
            patterns: [{ from: copyDir, to: '' }],
         }),
      ];
   }

   return [];
};

// https://www.npmjs.com/package/assets-webpack-plugin
// If you use webpack multi-compiler mode and want your assets written to a
// single file, you must use the same instance of the plugin in the
// different configurations.
exports.AssetsPlugin = () => {
   return new AssetsPlugin({
      metadata: {
         project: {
            name: projInfo.pkgName,
            version: projInfo.pkgVersion,
            dirname: config.paths.PROJECT_DIRNAME,
         },
         timestamp: timestamp,
         mode: process.env.NODE_ENV,
         dist: config.paths.DIST.dirname,
         publicPath: config.paths.PUBLIC,
         differentialServe: isDifferentialBuild,
         webpackEntries: config.javascript.entry,
         devServer: {
            protocol: server.url.protocol,
            host: server.url.domain,
            port: server.dsPort,
         },
      },

      // Name for the created json file.
      // Optional. webpack-assets.json by default.
      filename: JSON.parse(config.globals.assetsJsonFile),

      // If false the output will not include the full path of the
      // generated file.
      // Optional. true by default.
      // e.g. "/public/path/bundle.js" vs "bundle.js"
      fullPath: false,

      // If true the full path will automatically be stripped of the
      // /auto/ prefix generated by webpack.
      // Optional. false by default.
      // e.g. "/public/path/bundle.js" vs "bundle.js"
      removeFullPathAutoPrefix: false,

      // Inserts the manifest javascript as a text property in your assets.
      // Accepts the name or names of your manifest chunk. A manifest is
      // the last CommonChunk that only contains the webpack bootstrap code.
      // This is useful for production use when you want to inline the
      // manifest in your HTML skeleton for long-term caching.
      includeManifest: false,

      // Orders the assets output so that manifest is the first entry.
      // This is useful for cases where script tags are generated from
      // the assets json output, and order of import is important.
      manifestFirst: true,

      // Path where to save the created JSON file. Will default to the
      // highest level of the project unless useCompilerPath is specified.
      // Optional. Defaults to the current directory.
      // path: isProduction
      //    ? // it gets deleted by webpack's clean,
      //      // therefore it's in the root in production.
      //      process.cwd()
      //    : path.join(process.cwd(), config.paths.DIST.dirname),

      // `true` will use the compiler output path from the webpack config.
      // When developing for a CMS, the file is written into the root.
      useCompilerPath: true,

      // When set false, falls back to the fileTypes option array to decide
      // which file types to include in the assets file.
      // Optional. true by default.
      includeAllFileTypes: false,

      // When set and includeAllFileTypes is set false, only assets matching
      // these types will be included in the assets file.
      // Optional. ['js', 'css'] by default.
      fileTypes: ['mjs', 'js', 'css'],

      // When set, will output any files that are part of the chunk and marked
      // as preloadable or prefechtable child assets via a dynamic import.
      includeDynamicImportedAssets: false,

      // When set, the assets file will only be generated in memory while
      // running webpack-dev-server and not written to disk.
      // Optional. false by default.
      keepInMemory: isServing,

      // When set the output from webpack-subresource-integrity is included
      // in the assets file.
      // Please make sure you have webpack-subresource-integrity installed
      // and included in your webpack plugins.
      // integrity: true,

      // If the 'entrypoints' option is given, the output will be limited
      // to the entrypoints and the chunks associated with them.
      // Optional. false by default.
      entrypoints: true,

      // Whether to format the JSON output for readability.
      // Optional. false by default.
      prettyPrint: true,
   });
};
