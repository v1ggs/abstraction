// ############################################################################
// ################################################################# FILE TYPES
// ############################################################################

const { config } = require('../init');
const { isWordPress } = require('../../utils/abstraction');
const userTemplates = config?.templates?.customLoader?.fileTypes;
let templateFileTypes;

if (isWordPress) {
   templateFileTypes = ['php', 'html'];
} else {
   // userTemplates.length > 0 is there because it is an empty
   // array in the default config
   templateFileTypes =
      userTemplates && Array.isArray(userTemplates) && userTemplates.length > 0
         ? // if using another templates loader
           userTemplates
         : // if using simple-nunjucks-loader
           ['njk', 'nunjucks', 'html'];
}

exports.filetypes = {
   templates: templateFileTypes,
   javascript: ['mjs', 'js'],
   sass: ['scss', 'sass', 'css'],
   images: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
   fonts: ['woff', 'woff2', 'eot', 'ttf', 'otf'],
   video: ['mp4', 'mpeg', 'mpg', 'webm'],
   audio: ['mp3', 'wma', 'wav'],
   documents: ['pdf', 'csv'],
   icons: ['ico'],
   svg: ['svg'],
};
