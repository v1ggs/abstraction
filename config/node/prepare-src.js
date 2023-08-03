const path = require('path');
const { paths } = require('../webpack/paths');
const { writeFile, existsSync, mkdir } = require('fs');
const { consoleMsg } = require('../../utils/abstraction');

module.exports = () => {
   const srcDir = paths.SRC.absolute;
   const jsEntry = path.join(srcDir, 'index.js');
   const scssEntry = path.join(srcDir, 'index.scss');

   if (!existsSync(srcDir))
      mkdir(srcDir, { recursive: true }, err => {
         if (err) consoleMsg.severe(err);
      });

   writeFile(
      jsEntry,
      "// This is the JavaScript entry point.\n\nimport './index.scss';\n",
      err => {
         if (err) consoleMsg.severe(err);
      },
   );

   writeFile(scssEntry, '// This is the SCSS entry point.\n', err => {
      if (err) consoleMsg.severe(err);
   });
};
