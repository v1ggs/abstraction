const { config } = require('../init');
const { filetypes } = require('../webpack/filetypes');
const { filetypesArr2regex } = require('../../utils/js');
const { isProduction } = require('../../utils/abstraction');

// https://www.npmjs.com/package/image-minimizer-webpack-plugin
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

// For lossy optimization we recommend using the default settings of sharp package.
// The default values and supported file types for each option can be found in the
// sharp documentation: https://sharp.pixelplumbing.com/api-output
// const encodeOptions = (filetype, quality) => {
//    const options = {
//       jpeg: {
//          quality: quality,
//          progressive: true,
//       },

//       webp: {
//          quality: quality,

//          // 0-6, default 4
//          effort: isProduction ? 6 : 0,

//          // lossless: true, // probably enable this, webp is small
//       },

//       png: {
//          progressive: true,

//          // png by default sets the quality to 100%, which is same as lossless
//          quality: quality,

//          // 0 (fastest, largest) to 9 (slowest, smallest) (optional, default 6)
//          compressionLevel: isProduction ? 9 : 0,

//          // 1 (fastest) and 10 (slowest), sets palette to true (optional, default 7)
//          effort: isProduction ? 10 : 1,
//       },

//       gif: {
//          // 1-10 (slowest), default 7
//          effort: isProduction ? 10 : 1,
//       },
//    };

//    if (!options[filetype]) return undefined;
//    return options[filetype];
// };

// const minimizers = (cfgArray) => {
//    return cfgArray.map((cfg) => {
//       return {
//          implementation: ImageMinimizerPlugin.sharpMinify,
//          filename: `[name].[${cfg.width}][ext]`,

//          options: {
//             resize: {
//                enabled: true,
//                width: cfg.width,
//             },

//             // For lossy optimization we recommend using the default settings of sharp package. The default
//             // values and supported file types for each option can be found in the sharp documentation:
//             // https://sharp.pixelplumbing.com/api-output
//             encodeOptions: {
//                // https://sharp.pixelplumbing.com/api-output#jpeg
//                jpeg: {
//                   quality: cfg.quality,
//                   progressive: true,
//                },

//                // https://sharp.pixelplumbing.com/api-output#webp
//                webp: {
//                   quality: cfg.quality,
//                   effort: isProduction ? 6 : 0, // 0-6, default 4
//                   // lossless: true, // probably enable this, webp is small
//                },

//                // https://sharp.pixelplumbing.com/api-output#png
//                png: {
//                   progressive: true,
//                   // png by default sets the quality to 100%, which is same as lossless
//                   quality: cfg.quality,
//                   compressionLevel: isProduction ? 9 : 0, // 0 (fastest, largest) to 9 (slowest, smallest) (optional, default 6)
//                   effort: isProduction ? 10 : 1, // 1 (fastest) and 10 (slowest), sets palette to true (optional, default 7)
//                },

//                // https://sharp.pixelplumbing.com/api-output#gif
//                gif: {
//                   effort: isProduction ? 10 : 1, // 1-10 (slowest), default 7
//                },
//             },
//          },
//       };
//    });
// };

// const generators = (filetype, width, quality) => {
//    filetype = filetype === 'jpg' ? 'jpeg' : filetype;

//    return {
//       implementation: ImageMinimizerPlugin.sharpGenerate,

//       // You can apply generator using `?as=webp`, you can use any name and provide more options
//       preset: filetype,

//       // Apply generator for copied assets
//       type: 'asset',

//       // filename: `[name].[720][ext]`,

//       options: {
//          resize: {
//             enabled: true,
//             width: width,
//          },

//          encodeOptions: encodeOptions(filetype, quality),
//       },
//    };
// };

// exports.plugin = (() => {
//    const cfgObject = config.images;
//    const generatorCfg = [];

//    Object.keys(cfgObject).forEach((filetype) => {
//       const quality = Object.values(cfgObject[filetype]);
//       const width = Object.keys(cfgObject[filetype]).map((w) => {
//          // removes 'w' prefix
//          return (w = w.slice(1));
//       });

//       let i = 0;
//       const itemsCount = quality.length;

//       for (i; i < itemsCount; i++) {
//          generatorCfg.push(generators(filetype, width[i], quality[i]));
//       }
//    });
// })();

// *****************************************************
// multiple sizes not possible, some attempts are above.
// *****************************************************
module.exports = (() => {
   const cfg = config.images;

   return new ImageMinimizerPlugin({
      test: filetypesArr2regex(filetypes.images),
      deleteOriginalAssets: false,
      minimizer: {
         implementation: ImageMinimizerPlugin.sharpMinify,

         // filename: `[name].[${cfg.width}][ext]`,

         options: {
            // Don't resize for now, small images get enlarged.
            // resize: {
            //    enabled: true,
            //    width: cfg.width,
            // },

            // For lossy optimization we recommend using the default settings of sharp package. The default
            // values and supported file types for each option can be found in the sharp documentation:
            // https://sharp.pixelplumbing.com/api-output
            encodeOptions: {
               // https://sharp.pixelplumbing.com/api-output#jpeg
               jpeg: {
                  quality: cfg.quality,
                  progressive: true,
               },

               // https://sharp.pixelplumbing.com/api-output#webp
               webp: {
                  quality: cfg.quality,
                  effort: isProduction ? 6 : 0, // 0-6, default 4
                  // lossless: true, // probably enable this, webp is small
               },

               // https://sharp.pixelplumbing.com/api-output#png
               png: {
                  progressive: true,
                  // png by default sets the quality to 100%, which is same as lossless
                  quality: cfg.quality,
                  compressionLevel: isProduction ? 9 : 0, // 0 (fastest, largest) to 9 (slowest, smallest) (optional, default 6)
                  effort: isProduction ? 10 : 1, // 1 (fastest) and 10 (slowest), sets palette to true (optional, default 7)
               },

               // https://sharp.pixelplumbing.com/api-output#gif
               gif: {
                  effort: isProduction ? 10 : 1, // 1-10 (slowest), default 7
               },
            },
         },
      },
   });
})();
