const fs = require('fs');
const url = require('url');
const path = require('path');
const getUserConfig = require('./get-config-user');

const config = getUserConfig();

const parseUrl = href => {
   // Nodejs:url won't work without a protocol specified,
   // e.g. if only 'localhost:<port>' is provided in config.
   if (!href.includes('http')) {
      // If there's no protocol, it's http.
      href = 'http://' + href;
   }

   const parsed = url.parse(href);

   return {
      href: parsed.href, // Use this for proxying.
      protocol: parsed.protocol,
      domain: parsed.hostname.replace(/(www\.)/, ''),
      port: parsed.port,
   };
};

// If we're on SSL, what domain and certificate to use.
const sslConfig = href => {
   const server = parseUrl(href);
   // Add it here, instead of `get-paths.js`,
   // to avoid circular dependency with it.
   const certDir = path.resolve(process.cwd(), '.cert');
   let mkcertCert = path.join(certDir, server.domain + '.pem');
   let mkcertKey = path.join(certDir, server.domain + '-key.pem');

   if (!(fs.existsSync(mkcertCert) && fs.existsSync(mkcertKey))) {
      mkcertCert = false;
      mkcertKey = false;
   }

   return {
      certDir,
      cert: mkcertCert,
      key: mkcertKey,
   };
};

const domain = config?.server?.backend
   ? // With backend, use the same domain, different port.
     config.server.backend
   : 'localhost';

const sslCfg = sslConfig(domain);

module.exports = {
   isSsl: sslCfg.cert && sslCfg.key,
   certDir: sslCfg.certDir,
   url: parseUrl(domain),
   // Configured in one place: other modules use it too.
   dsPort: 8080, // devserver default

   devServer: {
      ssl: {
         cert: sslCfg.cert,
         key: sslCfg.key,
      },
   },
};
