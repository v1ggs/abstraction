// BrowserSync is being used only when developing with WordPress.
// Proxy to Flywheel Local's `https` does not work.
// When proxying from `https` (Webpack devServer) to `http` (Flywheel Local),
// assets requested from `http` can't be loaded in browser.
// Also WordPress' (absolute) links don't work with Webpack devServer,
// they point to the original domain.
// BrowserSync solves these problems.
// Webpack devServer provides hot module replacement (HMR),
// that's why we're using two servers.

const { config } = require('../../utils/get-config');
const { merge } = require('../../utils/js');
const { isProduction } = require('../../utils/abstraction');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const {
   useSsl,
   consoleMsg,
   isWordPress,
   clearScreen,
} = require('../../utils/abstraction');

// // array of capturing groups, full match is 0
// const parseDomain = proxy2domain.match(
//    // finds (protocol), (domain name or ip), (port or domain
//    // extension) and (trailing slash)
//    /^(https?:\/\/)(.+?)(:\d+|\.\D+)?(\/)?$/i,
// );

// BrowserSync options
const bsDefault = {
   host: useSsl.domain,
   // port: 3000,
   proxy: config.server.proxy,
   watchEvents: false,
   injectChanges: false,
   notify: false, // Don't show any notifications in browser.
   // Open the external URL - must be online.
   open: useSsl.protocol === 'https://' ? 'external' : 'local',
};

if (
   isWordPress &&
   !isProduction &&
   process.env.ABSTRACTION_SERVE &&
   useSsl.protocol === 'https://'
) {
   bsDefault.https = {
      key: useSsl.sslKeyFile,
      cert: useSsl.sslCertFile,
   };

   // Add CSP in development, to allow some mixed content from WordPress.
   bsDefault.rewriteRules = [
      {
         // Meta charset can change.
         // `$0` does not work, therefore using a capturing
         // group for the whole match.
         match: /(<meta charset=.*?>)/g,
         replace:
            '$1\n\t<meta http-equiv="Content-Security-Policy" ' +
            'content="upgrade-insecure-requests">',
      },
   ];

   // The screen is cleared with "single runtime info".
   Object.keys(config.javascript.entry).length <= 1 && clearScreen();

   // In order to use BrowserSync's "external" address,
   // an internet connection is required.
   consoleMsg.warning(
      'In order to use `' +
         useSsl.protocol +
         useSsl.domain +
         // Port hardcoded, although it might change, because the user needs
         // a hint what domain the information is about.
         ':3000`, you will need an internet connection.',
   );
}

module.exports = new BrowserSyncPlugin(
   // BrowserSync Options
   // https://browsersync.io/docs/options/
   merge(bsDefault, config.server.browserSync),

   // BrowserSyncPlugin Options
   {
      // Prevent BrowserSync from reloading the page
      // and let Webpack Dev Server take care of this.
      reload: false,
   },
);
