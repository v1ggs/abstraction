// https://www.npmjs.com/package/svg-sprite-loader
// In the extract mode loader should be configured with plugin,
// otherwise an error is thrown.
const SpritePlugin = require('svg-sprite-loader/plugin');

// For some reason the plugin does not work for now.
module.exports = () => {
   // https://css-tricks.com/svg-fragment-identifiers-work/#aa-i-just-wanna-stack-the-icons-on-top-of-each-other
   // You can render plain sprite in extract mode without styles and usages.
   // Pass plainSprite: true option to plugin constructor.
   return new SpritePlugin({ plainSprite: false });
};
