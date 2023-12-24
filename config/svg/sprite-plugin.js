// https://www.npmjs.com/package/svg-sprite-loader
// In the extract mode loader should be configured
// with plugin, otherwise an error is thrown.
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

// const { replaceSpritePlaceholder } = require('svg-sprite-loader/lib/utils');
const escapeRegExpSpecialChars = require('escape-string-regexp');
const isWindows = /^win/i.test(process.platform);

// Replaces system paths with resolved svg sprite paths and IDs.
// Modified the original, to replace paths which contain spaces.
/**
 * @param {string} content
 * @param {Object<string, string>} replacements
 * @return {string}
 */
function replaceSpritePlaceholder(content, replacements) {
   let result = content;
   const newObj = {};

   // Replace spaces with `%20`, because that's how it's in the content.
   Object.keys(replacements).forEach(item => {
      // Probably should be done with encodeURI().
      newObj[item.replace(/ /g, '%20')] = replacements[item];
   });

   // Apply both methods, just in case...

   Object.keys(replacements).forEach(item => {
      const re = new RegExp(escapeRegExpSpecialChars(item), 'g');

      if (isWindows) {
         result = result.replace(/\\\\/g, '\\').replace(re, replacements[item]);
      } else {
         result = result.replace(re, replacements[item]);
      }
   });

   Object.keys(newObj).forEach(item => {
      const re = new RegExp(escapeRegExpSpecialChars(item), 'g');

      if (isWindows) {
         // Double slashes are replaced above.
         result = result.replace(re, newObj[item]);
      } else {
         result = result.replace(re, newObj[item]);
      }
   });

   return result;
}

// Fixes an issue with mini-css-extract-plugin: svg file paths were not resolved.
// https://github.com/JetBrains/svg-sprite-loader/issues/465#issuecomment-990993090
class MiniCssExtractSpriteLoaderPlugin extends SpriteLoaderPlugin {
   apply(compiler) {
      super.apply(compiler);

      if (compiler.hooks) {
         compiler.hooks.thisCompilation.tap(super.NAMESPACE, compilation => {
            compilation.hooks.afterOptimizeChunks.tap(super.NAMESPACE, chunks =>
               chunks.forEach(chunk => {
                  compilation.chunkGraph
                     .getChunkModules(chunk)
                     .filter(module => module.type === 'css/mini-extract')
                     .forEach(module => {
                        // eslint-disable-next-line no-param-reassign
                        module.content = Buffer.from(
                           replaceSpritePlaceholder(
                              module.content.toString(),
                              super.getReplacements(),
                           ),
                        );
                     });
               }),
            );
         });
      }
   }
}

module.exports = () => {
   // You can render plain sprite in extract mode without styles and usages.
   // Pass plainSprite: true option to plugin constructor.
   // https://css-tricks.com/svg-fragment-identifiers-work/#aa-i-just-wanna-stack-the-icons-on-top-of-each-other
   return new MiniCssExtractSpriteLoaderPlugin({ plainSprite: false });
};
