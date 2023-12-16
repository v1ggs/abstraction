// Warning
// Be aware that when exporting multiple configurations only the devServer
// options for the first configuration will be taken into account and used
// for all the configurations in the array.
//
// Tip
// If you're having trouble, navigating to the /webpack-dev-server route will show
// where files are served. For example, http://localhost:9000/webpack-dev-server.
//
// Tip
// If you want to manually recompile the bundle, navigating to the
// /webpack-dev-server/invalidate route will invalidate the current compilation
// of the bundle and recompile it for you via webpack-dev-middleware. Depending on your
// configuration, the URL may look like http://localhost:9000/webpack-dev-server/invalidate.

const { merge } = require('../../utils/js');
const { config } = require('../../utils/get-config');
const server = require('../../utils/get-config-server');
// const { filetypes } = require('../../utils/get-filetypes');
const { isCMS, isProduction } = require('../../utils/abstraction');

// const templateExts =
//    filetypes.templates.length > 1
//       ? '{' + filetypes.templates.join() + '}'
//       : filetypes.templates[0];

// https://webpack.js.org/configuration/dev-server/
const dsConfig = {
   // If you want your server to be accessible externally,
   // specify it like this: devServer: { host: '0.0.0.0' }.
   host: server.url.domain,

   port: server.dsPort,

   // To enable Hot Module Replacement without page refresh as
   // a fallback in case of build failures, use hot: 'only'.
   hot: true,

   server: server.isSsl
      ? {
           type: 'https',
           options: server.devServer.ssl,
        }
      : {
           type: 'http',
        },

   // Tells dev-server to open the browser after the server has started.
   // https://webpack.js.org/configuration/dev-server/#devserveropen
   open: !isCMS(), // Use the backend domain with a CMS, just enqueue built JS.

   client: {
      // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      logging: isProduction ? 'error' : 'warn',

      // Prints compilation progress in percentage in the browser.
      // progress: config.debug,
   },

   // https://webpack.js.org/configuration/dev-server/#devserverallowedhosts
   // This option allows you to allowlist services that are allowed to access the dev server.
   // Mimicking Django's ALLOWED_HOSTS, a value beginning with . can be used as a subdomain
   // wildcard. .host.com will match host.com, www.host.com, and any other subdomain of host.com.
   // When set to 'auto' this option always allows localhost, host, and client.webSocketURL.hostname.
   // When set to 'all' this option bypasses host checking. THIS IS NOT RECOMMENDED as apps
   // that do not check the host are vulnerable to DNS rebinding attacks.
   // 'auto' | 'all' | [string]
   //
   // Prevents getting the `Invalid Host/Origin header` error.
   allowedHosts: ['localhost', 'host'].concat(
      server.url.domain !== 'localhost' ? ['.' + server.url.domain] : [],
   ),

   // This option allows you to configure a list of globs/directories/files to
   // watch for file changes.
   // It is possible to configure advanced options for watching files.
   // See the chokidar documentation for the possible options.
   // watchFiles: {
   //    // Webpack-dev-server doesn't watch HTML files by default.
   //    paths: ['/**/*.' + templateExts],
   //    options: {
   //       cwd: '.',

   //       // Ignore dot-dirs.
   //       ignored: ['.*/**'],

   //       // It is typically necessary to set this to true to successfully watch
   //       // files over a network, and it may be necessary to successfully watch
   //       // files in other non-standard situations.
   //       // If polling leads to high CPU utilization, consider setting
   //       // this to false.
   //       usePolling: false,
   //    },
   // },

   // By default, the dev-server will reload/refresh the page when file
   // changes are detected.
   // devServer.hot option must be disabled or devServer.watchFiles option
   // must be enabled in order for liveReload to take effect.
   // Disable devServer.liveReload by setting it to false.
   // Warning:
   // Live reloading works only with web related targets like web,
   // webworker, electron-renderer and node-webkit.
   // liveReload: false,

   // https://stackoverflow.com/questions/43387450/wordpress-redirecting-to-siteurl-when-accessed-via-webpack-dev-server-proxy
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
         'X-Requested-With, content-type, Authorization',
   },
};

// Override with the user's config.
module.exports = merge(dsConfig, config.server.devServer);
