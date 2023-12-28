const { config } = require('../../utils/get-config');

const plugins = Object.keys(config.svg.optimize);
const overrides = {};

plugins.forEach(plugin => {
   if (config.svg.optimize[plugin]) {
      if (plugin === 'removeDesc') {
         overrides[plugin] = {
            // By default, this plugin only removes descriptions that are either
            // empty or contain editor attribution.
            // Enabling this removes the <desc> element indiscriminately.
            removeAny: true,
         };
      }
   } else {
      // Disable preset-default's plugins.
      overrides[plugin] = false;
   }
});

// https://github.com/svg/svgo#configuration
// https://github.com/svg/svgo#built-in-plugins
module.exports = {
   test: /\.svg$/i,

   use: [
      {
         loader: 'svgo-loader',

         options: {
            // Pass over SVGs multiple times to ensure all
            // optimizations are applied. False by default.
            multipass: true,
            plugins: [
               {
                  // Set of built-in plugins enabled by default.
                  // https://svgo.dev/docs/preset-default/
                  name: 'preset-default',
                  params: {
                     overrides: overrides,
                  },
               },
            ],
         },
      },
   ],
};
