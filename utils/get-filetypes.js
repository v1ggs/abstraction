const { config } = require('./get-config');
const { isCMS } = require('./abstraction');
const userTemplateFileTypes = config?.templates?.customLoader?.fileTypes;

let templateFileTypes = isCMS()
   ? // Work with a CMS.
     ['php', 'inc', 'module', 'html', 'htm']
   : // Use front-end templates.
     userTemplateFileTypes &&
       Array.isArray(userTemplateFileTypes) &&
       userTemplateFileTypes.length > 0
     ? // User configured a templates loader.
       userTemplateFileTypes
     : // Use the default simple-nunjucks-loader.
       ['nj', 'njk', 'nunjucks', 'html', 'htm'];

exports.filetypes = {
   templates: templateFileTypes,
   javascript: ['mjs', 'js'],
   sass: ['scss', 'sass', 'css'],
   images: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
   fonts: ['woff', 'woff2', 'eot', 'ttf', 'otf'],
   video: ['mp4', 'mpeg', 'mpg', 'webm'],
   audio: ['mp3', 'wma', 'wav'],
   documents: ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'csv'],
   icons: ['ico'],
   svg: ['svg'],
};
