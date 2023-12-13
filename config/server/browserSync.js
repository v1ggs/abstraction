// BrowserSync is being used only when developing with a CMS.
// Proxy to Flywheel Local's `https` does not work.
// When proxying with devServer from `http` (Flywheel Local) to `https`,
// assets requested from `http` can't be loaded in browser.
// Also WordPress' (absolute) links don't work with Webpack devServer,
// they point to the original backend domain.
// BrowserSync solves these problems.
// Webpack devServer provides hot module replacement (HMR),
// that's why we're using two servers.

const { merge } = require('../../utils/js');
const { config } = require('../../utils/get-config');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const {
   isCMS,
   parseUrl,
   sslConfig,
   consoleMsg,
} = require('../../utils/abstraction');

const cms = isCMS();

const server = config?.server?.backend
   ? parseUrl(config?.server?.backend)
   : false;

const ssl = config?.server?.backend
   ? sslConfig(config?.server?.backend)
   : false;

// https://browsersync.io/docs/options/
const bsDefault = {
   host: server?.domain || 'localhost',
   port: 3000, // default 3000
   proxy: config.server.backend,
   watchEvents: false,
   injectChanges: false,
   notify: false, // Don't show any notifications in browser.
   // 'external' = proxy:port, must be online.
   // 'local' = localhost:port
   open: 'external',
};

if (
   cms &&
   process.env.ABSTRACTION_SERVE &&
   ssl?.sslKeyFile &&
   ssl?.sslCertFile
) {
   bsDefault.https = {
      key: ssl.sslKeyFile,
      cert: ssl.sslCertFile,
   };

   // Add a CSP, to allow mixed content from a CMS.
   bsDefault.rewriteRules = [
      {
         // Meta charset can be changed.
         // `$0` does not work, therefore using a
         // capturing group for the whole match.
         match: /(<meta charset=.*?>)/g,
         replace:
            '$1\n\t<meta http-equiv="Content-Security-Policy" ' +
            'content="upgrade-insecure-requests">',
      },
   ];

   // In order to use BrowserSync's "external" address,
   // an internet connection is required.
   consoleMsg.warning(
      `In order to use "https://${bsDefault.host}:${bsDefault.port}", you will need an internet connection.\n`,
   );
}

module.exports = new BrowserSyncPlugin(
   // BrowserSync Options
   merge(bsDefault, config.server.browserSync),

   // BrowserSyncPlugin Options
   {
      // Prevent BrowserSync from reloading the page
      // and let Webpack Dev Server take care of this.
      reload: false,
   },
);
