#!/usr/bin/env node

// Creates SSL certificates for the development, if mkcert is installed.

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { paths } = require('../utils/get-paths');
const server = require('../utils/get-config-server');
const { consoleMsg } = require('../utils/abstraction');
const { getUserConfig } = require('../utils/get-config-user');

const userConfig = getUserConfig();

// We need a domain that is being blocked with hosts file,
// not the project's dir name.
const domain = server.url.domain;

const certPath = paths.SSLCERT;
const certDir = path.parse(certPath).name;
const gitIgnore = path.resolve(paths.ROOT, '.gitignore');
const npmIgnore = path.resolve(paths.ROOT, '.npmignore');
const mkcertCertPath = path.join(certPath, domain + '.pem');
const mkcertKeyPath = path.join(certPath, domain + '-key.pem');

// Git ignore certificate.
if (fs.existsSync(gitIgnore)) {
   let gitIgnoreContent = fs.readFileSync(gitIgnore);

   if (!gitIgnoreContent.includes(certDir)) {
      // clearScreen();
      consoleMsg.info(`Adding "${certDir}" to ".gitignore".`);

      gitIgnoreContent = certDir + '\n\n' + gitIgnoreContent;

      fs.writeFileSync(gitIgnore, gitIgnoreContent);
   }
}

// NPM ignore certificate.
if (fs.existsSync(npmIgnore)) {
   let npmIgnoreContent = fs.readFileSync(npmIgnore);

   if (!npmIgnoreContent.includes(certDir)) {
      consoleMsg.info(`Adding "${certDir}" to ".npmignore".`);

      npmIgnoreContent = certDir + '\n\n' + npmIgnoreContent;

      fs.writeFileSync(npmIgnore, npmIgnoreContent);
   }
}

if (!(fs.existsSync(mkcertCertPath) && fs.existsSync(mkcertKeyPath))) {
   // mkcert will fail if the dir does not exist.
   if (!fs.existsSync(certPath)) {
      fs.mkdirSync(certPath);
   }

   exec(`cd ${certPath} && mkcert ${domain}`, error => {
      if (error) {
         // It will exit.
         consoleMsg.severe(error);

         // appConsoleLog.warning(
         //    '\nMkcert is not installed on this machine. ' +
         //       '\nIf you want to use SSL in development, you will have to ' +
         //       'create certificate and configure server(s) manually.',
         // );
         // return;
      }

      let hostsMsg = '';
      if (
         !(
            domain === 'localhost' ||
            domain === '127.0.0.0' ||
            domain === '0.0.0.0'
         )
      ) {
         hostsMsg = `\nIf you can't access "${domain}" in your browser, you should redirect it to "127.0.0.0" or "0.0.0.0" with hosts file.`;
      }

      // clearScreen();
      consoleMsg.succes(
         `Please find certificate for "${domain}" in "${certPath}".\n` +
            `Make sure to include "${certDir}" in your "ignore" files.\n` +
            'It should be automatically added to ".gitignore" and ".npmignore", if they were found. Please check.' +
            hostsMsg,
      );
   });
} else {
   // A certificate exists.
   consoleMsg.info(
      `An SSL certificate for "${domain}" already exists in "${certPath}".`,
   );
}
