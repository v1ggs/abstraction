const svgoLoader = require('./svgo-loader');
const SpritePlugin = require('./sprite-plugin');
const spriteLoader = require('./svg-sprite-loader');
const { config } = require('../../utils/get-config');
const inlineSvgInCss = require('./inline-in-css-loader');

const loaders = [spriteLoader]
   .concat(config.svg.extract.includes('css') ? [] : inlineSvgInCss)
   .concat(svgoLoader);

exports.svg = {
   loaders,
   SpritePlugin,
};
