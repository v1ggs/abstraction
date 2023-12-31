const svgoLoader = require('./svgo-loader');
const SpritePlugin = require('./sprite-plugin');
const spriteLoader = require('./svg-sprite-loader');
const { config } = require('../../utils/get-config');
const svgInHtmlLoader = require('./svg-in-html-loader');
const inlineSvgInCss = require('./inline-in-css-loader');

const loaders = [spriteLoader]
   .concat(config.svg.extractFrom.includes('css') ? [] : inlineSvgInCss)
   // Separate loader for templates is required.
   .concat(svgInHtmlLoader)
   .concat(svgoLoader);

exports.svg = {
   loaders,
   SpritePlugin,
};
