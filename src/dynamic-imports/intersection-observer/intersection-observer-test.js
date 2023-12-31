/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
export default () => {
   if (
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype
   ) {
      // Minimal polyfill for Edge 15's lack of `isIntersecting`
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
         Object.defineProperty(
            window.IntersectionObserverEntry.prototype,
            'isIntersecting',
            {
               get: function () {
                  return this.intersectionRatio > 0;
               },
            },
         );
      }

      return true;
   }
};
