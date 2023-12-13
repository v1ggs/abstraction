// ############################################################################
// ################################################################# FILE TYPES
// ############################################################################

const { config } = require('./get-config');
const { isWP } = require('./abstraction');
const userTemplateFileTypes = config?.templates?.customLoader?.fileTypes;
const isWordPress = isWP();

let templateFileTypes = isWordPress
   ? // We're working with WordPress.
     ['php', 'html']
   : // We're using front-end templates.
     userTemplateFileTypes &&
       Array.isArray(userTemplateFileTypes) &&
       userTemplateFileTypes.length > 0
     ? // User configured a templates loader.
       userTemplateFileTypes
     : // Using the default simple-nunjucks-loader.
       ['njk', 'nunjucks', 'html'];

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
