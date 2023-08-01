const { config } = require('../../utils/get-config');

const overrides = {};

// 'default' will apply 'preset-default'.
// 'default-light': 'preset-default', but keeps title, description and comments.
// 'default-light-no-comments': 'preset-default', but keeps title and description.
if (
   config.images.minifySvg === 'default-light' ||
   config.images.minifySvg === 'default-light-no-comments'
) {
   overrides.removeTitle = false;
   overrides.removeDesc = false;
}

if (config.images.minifySvg === 'default-light') {
   overrides.removeComments = false;
}

// https://github.com/svg/svgo#configuration
// https://github.com/svg/svgo#built-in-plugins
module.exports = {
   // test: /\.svg$/i,
   loader: 'svgo-loader',
   options: {
      multipass: true,
      plugins: [
         {
            name: 'preset-default',
            params: {
               overrides: overrides,
            },
         },
      ],
   },
};
