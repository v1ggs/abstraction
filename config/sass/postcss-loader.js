const path = require('path');

// POST-CSS LOADER - processes on css:
// purge unused selectors, fix flex bugs, px to rem, sort media queries...
module.exports = {
   loader: 'postcss-loader',
   options: {
      postcssOptions: {
         config: path.resolve(__dirname, 'postcss.config.js'),
      },
   },
};
