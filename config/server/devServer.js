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

const path = require('path');
const { merge } = require('../../utils/js');
const { paths } = require('../../utils/get-paths');
const { config } = require('../../utils/get-config');
const { filetypes } = require('../../utils/get-filetypes');
const { useSsl, isWP } = require('../../utils/abstraction');
const templateExts =
   filetypes.templates.length > 1
      ? '{' + filetypes.templates.join() + '}'
      : filetypes.templates[0];

const sslConfig = useSsl();
const isWordPress = isWP();

// https://webpack.js.org/configuration/dev-server/
const devServerDefault = {
   client: {
      // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
      logging: config.debug ? 'warn' : 'none',

      // Prints compilation progress in percentage in the browser.
      // progress: config.debug,
   },

   // This option allows you to configure a list of globs/directories/files to
   // watch for file changes.
   // It is possible to configure advanced options for watching files.
   // See the chokidar documentation for the possible options.
   // Webpack-dev-server doesn't watch HTML files by default.
   watchFiles: [
      isWordPress
         ? path.resolve(paths.ROOT + '/**/*.' + templateExts)
         : // Frontend templates are being watched, for devserver to reload.
           // They are also being watched by webpack to rebuild on change.
           path.resolve(paths.SRC.absolute + '/**/*.' + templateExts),
   ],

   // Specify a host to use. If you want your server to be accessible externally,
   // specify it like this: devServer: { host: '0.0.0.0' },
   // 'local-ip' | 'local-ipv4' | 'local-ipv6' string
   // ** REQUIRED ** for assets.json
   host: sslConfig.domain,

   // ** REQUIRED ** for assets.json
   port: 8080,

   // Tells dev-server to open the browser after server had been started.
   // Set it `true` to open your default browser.
   // https://webpack.js.org/configuration/dev-server/#devserveropen
   open: !isWordPress,

   // `server.type` ** REQUIRED ** for assets.json
   server:
      sslConfig.sslKeyFile && sslConfig.sslCertFile
         ? {
              type: 'https',
              options: {
                 key: sslConfig.sslKeyFile,
                 cert: sslConfig.sslCertFile,
              },
           }
         : {
              type: 'http',
           },

   /*
   proxy: proxy2domain
      ? {
           // https://stackoverflow.com/questions/43387450/wordpress-redirecting-to-siteurl-when-accessed-via-webpack-dev-server-proxy
           '/': {
              target: 'http://' + localWpDomain + localWpDomExt,

              // A backend server running on HTTPS with an invalid certificate will
              // not be accepted by default. If you want to, set `secure: false`.
              secure: false,

              // The origin of the host header is kept when proxying by default,
              // you can set changeOrigin to true to override this behaviour. It
              // is useful in some cases like using name-based virtual hosted sites.
              changeOrigin: true,

              autoRewrite: true,

              headers: { 'X-ProxiedBy-Webpack': true },
           },
        }
      : {},
      */

   // https://stackoverflow.com/questions/43387450/wordpress-redirecting-to-siteurl-when-accessed-via-webpack-dev-server-proxy
   headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
         'X-Requested-With, content-type, Authorization',
   },

   // gzip
   // compress: true,

   // https://webpack.js.org/configuration/dev-server/#devserverallowedhosts
   // This option allows you to allowlist services that are allowed to access the dev server.
   // Mimicking Django's ALLOWED_HOSTS, a value beginning with . can be used as a subdomain
   // wildcard. .host.com will match host.com, www.host.com, and any other subdomain of host.com.
   // When set to 'auto' this option always allows localhost, host, and client.webSocketURL.hostname.
   // 'auto' | 'all' | [string]
   // Prevents getting the `Invalid Host/Origin header` error.
   allowedHosts: ['.' + sslConfig.domain, 'localhost', 'host'],
};

module.exports = merge(devServerDefault, config.server.devServer);
