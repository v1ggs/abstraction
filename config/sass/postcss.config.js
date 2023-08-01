// https://webpack.js.org/loaders/postcss-loader/

const path = require('path');
const { config } = require('../../utils/get-config');
const { paths } = require('../webpack/paths');
const { filetypes } = require('../webpack/filetypes');
const { writeFileAsync } = require('../../utils/fs');

const keepSelectors = () => {
   if (
      Array.isArray(config?.css?.purge?.keepSelectors) &&
      config?.css?.purge?.keepSelectors?.length
   ) {
      return config?.css?.purge?.keepSelectors.map(selector => {
         if (selector.startsWith('.') || selector.startsWith('#')) {
            selector = selector.slice(1);
         }

         return new RegExp(`${selector}$`);
      });
   }

   return [];
};

// PurgeCss config
// https://www.purgecss.com/configuration.html#options
let purgeCssConfig = !config.css.purge
   ? false
   : {
        // Indicates what selectors to leave in the final CSS.
        safelist: {
           // matching selectors will be left in the CSS
           standard: [],

           // matching selectors and their children will be left in the CSS
           deep: keepSelectors(),

           // selectors whose any part matches will be left in the CSS
           greedy: [],
        },

        // Blocklist will block the CSS selectors from appearing in the output CSS.
        blocklist: [],

        // If true, purged selectors will be captured and rendered as PostCSS messages.
        rejected: true,

        // If you are using a CSS animation library such as animate.css, you can
        // remove unused keyframes by setting the keyframes option to true.
        keyframes: true,

        // If there are any unused @font-face rules in your css, you
        // can remove them by setting the fontFace option to true.
        fontFace: true,

        // If you are using Custom Properties (CSS variables), or a library using
        // them such as Bootstrap, you can remove unused CSS variables by setting
        // the variables option to true.
        variables: true,
     };

if (typeof purgeCssConfig === 'object') {
   // Creates an array of paths for purgeCss 'content' and
   // appends to each filetypes to scan.
   // The files can be HTML, Pug, Blade, etc.
   const analyzeFiles = [];

   config.includePaths.map(_path => {
      if (
         _path &&
         !['css', 'scss', 'sass', 'vendor'].some(filetype =>
            _path.includes(filetype),
         )
      ) {
         analyzeFiles.push(
            _path +
               `/**/*.{${filetypes.templates
                  .concat(filetypes.javascript)
                  .join()}}`,
         );
      }
   });

   // You can specify content that should be analyzed by Purgecss,
   // for the selectors to keep, with an array of filenames or globs.
   // The files can be HTML, Pug, Blade, etc.
   purgeCssConfig.content = analyzeFiles;
}

// Setting an unused plugin to an empty array, breaks postcss,
// false and '' work, but you never know...
// Loop through this array later and choose only plugins who are not false.
const postcssPlugins = [
   // https://www.npmjs.com/package/postcss-preset-env
   // Without any configuration options, PostCSS Preset Env enables
   // Stage 2 features and supports all browsers.
   // PostCSS Preset Env supports any standard browserslist configuration,
   // which can be a .browserslistrc file, a browserslist key in
   // package.json, or browserslist environment variables.
   ['postcss-preset-env'],

   // https://www.npmjs.com/package/@fullhuman/postcss-purgecss
   typeof purgeCssConfig === 'object' && [
      '@fullhuman/postcss-purgecss',
      purgeCssConfig,
   ],

   // https://www.npmjs.com/package/postcss-pxtorem
   config.css.px2rem && [
      'postcss-pxtorem',

      {
         // rootValue (Number | Function) Represents the root element font size
         // or returns the root element font size based on the input parameter
         rootValue: config.css.px2rem,

         // unitPrecision (Number) The decimal numbers to allow the REM
         // units to grow to
         unitPrecision: 5,

         // propList (Array) The properties that can change from px to rem.
         // Values need to be exact matches.
         // Use wildcard * to enable all properties. Example: ['*'].
         // Use * at the start or end of a word. (['*position*'] will
         // match background-position-y).
         // Use ! to not match a property. Example: ['*', '!letter-spacing'].
         // Combine the "not" prefix with the other prefixes. Example: ['*', '!font*'].
         propList: [
            '*',
            /*
			'font-size',
			'line-height',
			'letter-spacing',
			*/
         ],

         // selectorBlackList (Array) The selectors to ignore and leave as px.
         // If value is string, it checks to see if selector contains the string.
         // ['body'] will match .body-class
         // If value is regexp, it checks to see if the selector matches the regexp.
         // [/^body$/] will match body but not .body
         selectorBlackList: [],

         // replace (Boolean) Replaces rules containing rems instead of adding fallbacks
         replace: true,

         // mediaQuery (Boolean) Allow px to be converted in media queries
         mediaQuery: true,

         // minPixelValue (Number) Set the minimum pixel value to replace
         minPixelValue: 1,

         // exclude (String, Regexp, Function) The file path to ignore and leave as px.
         // If value is string, it checks to see if file path contains the string.
         // 'exclude' will match \project\postcss-pxtorem\exclude\path
         // If value is regexp, it checks to see if file path matches the regexp.
         // /exclude/i will match \project\postcss-pxtorem\exclude\path
         // If value is function, you can use exclude function to return a
         // true and the file will be ignored.
         // the callback will pass the file path as a parameter,
         // it should returns a Boolean result.
         // function (file) { return file.indexOf('exclude') !== -1; }
         exclude: false, // /node_modules/i,
      },
   ],

   // https://www.npmjs.com/package/postcss-flexbugs-fixes
   ['postcss-flexbugs-fixes'],

   // https://www.npmjs.com/package/postcss-sort-media-queries
   // Sorting works based on dutchenkoOleg/sort-css-media-queries function.
   config.css.sortMQ && [
      'postcss-sort-media-queries',

      {
         // {string} 'mobile-first' - (default) mobile first sorting
         // {string} 'desktop-first' - desktop first sorting
         sort: config.css.sortMQ,
      },
   ],

   // https://www.npmjs.com/package/postcss-reporter
   // https://github.com/postcss/postcss-reporter#options
   [
      'postcss-reporter',

      {
         // https://github.com/postcss/postcss-reporter#options
         // If true, the plugin will clear the result's messages after it logs them.
         // This prevents other plugins, or the task runner you use, from logging the
         // same information again and causing confusion.
         // (boolean, default = false)
         clearReportedMessages: true,

         // By default, this reporter will format the messages for human legibility
         // in the console. To use another formatter, pass a function that accepts an
         // object containing a messages array and a source string returns the string
         // to report.
         formatter(input) {
            let content = '';
            const pathInfo = path.parse(input.source.replace(/^\s+/gm, ''));
            const file = pathInfo.base;
            const folder = path.basename(pathInfo.dir);

            input.messages.forEach(message => {
               content +=
                  'FILE: ' +
                  file +
                  '\n' +
                  'PLUGIN: ' +
                  message.plugin.replace(/^\s+/gm, '').toUpperCase() +
                  '\n' +
                  'MESSAGE: ' +
                  message.text.replace(/^\s+/gm, '') +
                  '\n\n\n';
               writeFileAsync(
                  paths.LOGS +
                     '/' +
                     message.plugin.toUpperCase() +
                     '__' +
                     folder +
                     '--' +
                     file +
                     '.txt',
                  content,
               );
            });

            // Avoid printing anything in the console.
            return '';
         },

         // By default, only messages with type: "warning" are logged. (These are
         // the messages produced when the plugin author uses PostCSS's warn() function.)
         // For example, function(message) { return true } will return every message,
         // regardless of whether or not the plugin declares it as a warning.
         filter(/* message */) {
            // eslint-disable-line
            return true;
         },

         // (array of strings, default = [])
         // If plugins is empty (as it is by default), the reporter will log messages
         // from every PostCSS plugin.
         // There are 2 ways to limit output:
         // Whitelist: Provide an array of the plugins whose messages you would like
         // to show. For example, { plugins: ['postcss-bem-linter'] } will only log
         // messages from the postcss-bem-linter plugin.
         // Blacklist: Prefix all plugins in the array with ! to specify only those
         // plugins whose messages you would like to hide. All other plugins will
         // be shown. For example, { plugins: ['!postcss-bem-linter'] } will never
         // log messages from the postcss-bem-linter plugin; but will log messages
         // from every other plugin.
         plugins: [],
      },
   ],
];

// Loop through `postcssPlugins` array and choose only plugins who are not false.
// Setting an unused plugin to an empty array breaks postcss,
// false and '' work, but you never know...
const plugins = [];
let i = 0;

postcssPlugins.forEach(plugin => {
   if (plugin) {
      plugins[i] = plugin;
      i++;
   }
});

module.exports = {
   postcssOptions: {
      // By default generation of source maps depends on the devtool option.
      // All values enable source map generation except eval and false value.
      sourceMap: true,
   },

   plugins,
};
