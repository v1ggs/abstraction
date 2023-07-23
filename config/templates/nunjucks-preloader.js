// Creates `static` tag automatically, for each `acceptable`
// asset found in the template, for the user not to have to
// type it manually.
// Acceptable asset extensions array is sent with options.filetypes

const path = require('path');

// ============================================================================
// ===================================================================== Loader
// ============================================================================
module.exports = function (source) {
   // Loader options
   const options = this.getOptions();

   // return source.replaceAll( '\\"', '"' );

   const getAssets = (content) => {
      // Also finds escaped double quotes.
      // Returns an array of full matches, no capturing groups.
      const matches = content.match(
         /(?:src|href)\s*?=\s*?[\\]*?["'](.*?)[\\]*?["']/g,
      );

      return matches;
   };

   const parseAssetPath = (assetPath) => {
      // Also finds escaped double quotes.
      // No `global` flag.
      // match[0] is the full match.
      const match = assetPath.match(
         /(src|href)(\s*?=\s*?[\\]*?["'])(.*?)([\\]*?["'])/,
      );

      const _path = path.parse(match[3]);

      return {
         fullMatch: match[0],
         attribute: match[1], // src|href
         eqFirstQuote: match[2], // ="
         lastQuote: match[4],
         path: match[3],
         fileName: _path.name,
         extension: _path.ext.startsWith('.') ? _path.ext.slice(1) : _path.ext,
      };
   };

   // Eliminates anything that is not a relative path,
   // like `http(s)`, anchor links (#), base64...
   const checkRelative = (obj) => {
      if (!obj.path) return null;
      if (obj.path === obj.fileName) return null;
      return obj.path.startsWith('./') ? obj : null;
   };

   // Ensures only 'correct' assets are processed (no scripts, styles etc.).
   const checkFileType = (obj) => {
      if (!obj) {
         return null;
      }

      // Don't use obj.extension.slice(indexOf('.')) because of 'combined'
      // extensions (i.e. if a combined extension is sent without the first
      // dot, then only the part after the next dot will be used).
      obj.extension = obj.extension.startsWith('.')
         ? obj.extension.slice(1)
         : obj.extension;

      return options.filetypes.includes(obj.extension) ? obj : null;
   };

   const staticTag = (obj) => {
      obj.static = `{% static '${obj.path}' %}`;
      return obj;
   };

   // =========================================================================

   // Array of all `src`|`href` attributes
   const assets = getAssets(source);

   if (!assets) {
      return source;
   }

   // Parses path and returns an object with filename, extension and path.
   let _paths = assets.map(parseAssetPath); // object || null

   // Checks if it's a relative path (must be).
   _paths = _paths.map(checkRelative); // object || null

   // Ensures only 'correct' assets are imported (no scripts, styles, svg etc.).
   _paths = _paths.map(checkFileType); // object || null

   // Will take all files to be processed.
   const imports = [];

   // Elininates `null`s.
   let i = 0;
   _paths.forEach((element) => {
      if (element) {
         imports[i] = staticTag(element);
         i++;
      }
   });

   for (let j = 0; j < imports.length; j++) {
      const regex = new RegExp(
         `${imports[j].fullMatch.replaceAll('.', '\\.')}`,
         'g',
      );

      source = source.replaceAll(
         regex,
         imports[j].attribute +
            imports[j].eqFirstQuote +
            imports[j].static +
            imports[j].lastQuote,
      );
   }

   return source;
};

/*
Supported tags and attributes:

the src attribute of the img tag
the src attribute of the audio tag
the src attribute of the video tag
the src attribute of the embed tag
the src attribute of the input tag
the src attribute of the script tag
the src attribute of the source tag
the src attribute of the track tag

the srcset attribute of the img tag
the srcset attribute of the source tag

the xlink:href attribute of the script tag
the xlink:href attribute of the image tag
the xlink:href attribute of the use tag

the href attribute of the image tag
the href attribute of the script tag
the href attribute of the use tag
the href attribute of the link tag when the rel attribute contains stylesheet, icon, shortcut icon, mask-icon, apple-touch-icon, apple-touch-icon-precomposed, apple-touch-startup-image, manifest, prefetch, preload or when the itemprop attribute is image, logo, screenshot, thumbnailurl, contenturl, downloadurl, duringmedia, embedurl, installurl, layoutimage

the data attribute of the object tag

the poster attribute of the video tag

the imagesrcset attribute of the link tag when the rel attribute contains stylesheet, icon, shortcut icon, mask-icon, apple-touch-icon, apple-touch-icon-precomposed, apple-touch-startup-image, manifest, prefetch, preload

the content attribute of the meta tag when the name attribute is msapplication-tileimage, msapplication-square70x70logo, msapplication-square150x150logo, msapplication-wide310x150logo, msapplication-square310x310logo, msapplication-config, twitter:image or when the property attribute is og:image, og:image:url, og:image:secure_url, og:audio, og:audio:secure_url, og:video, og:video:secure_url, vk:image or when the itemprop attribute is image, logo, screenshot, thumbnailurl, contenturl, downloadurl, duringmedia, embedurl, installurl, layoutimage
the icon-uri value component in content attribute of the meta tag when the name attribute is msapplication-task
*/
