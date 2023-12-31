/* https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

W3C Polyfill (has some limitations):
https://github.com/GoogleChromeLabs/intersection-observer

Based on https://stackoverflow.com/a/64554206

- root (type: string - css selector): Intersection area, can be an element on a page. If undefined, viewport is the area.
- targets (type: string - css selector): Observed elements.
- callback (type: function) - Custom callback function to trigger when the target is visible and invisible. Receives `entry` and (observer's) `options` as arguments.
- percentage (type: array | number, 0-100): Visible percentage(s) (without `%`), e.g. 10 will trigger when 10% of the target is intersecting.
- unobserve (bolean) - If true, the target is unobserved after triggering the callback.

EXAMPLE:
Place it in 'load' event listener, to have accurate dimensions of elements in page.

const invertedHeader = new Observer({
   // Don't set it to have viewport as the intersection area.
   root: '.header--main',

   // Elements that trigger intersection callback.
   targets: '[data-bgd-dark]',

   // Intersection threshold(s) to trigger callback, on both in and out.
   percentage: [1, 16],

   // Callback function when observer is triggered.
   callback: myCallback,
});
*/

export default class Observer {
   constructor({
      root = false,
      targets = false,
      callback = false,
      percentage = false,
      unobserve = false,
   } = {}) {
      // This function converts the percentage to the required value.
      // It can be defined like percentage (without `%`), e.g. `90`.
      // Intersection observer needs a value between 0 and 1.
      const getRatio = () => {
         if (Array.isArray(percentage)) {
            percentage = percentage.map(ratio => {
               // If not defined or 0.
               if (!ratio) {
                  // for better browser support, intersection is being checked with
                  // `if (entry.isIntersecting || entry.intersectionRatio >= this.ratio)`.
                  // In case the ratio is 0, `entry.intersectionRatio >= this.ratio` for
                  // non-intersecting elements, will be true.
                  // Therefore:
                  ratio = 0.0001;
               } else {
                  // Get the proper value.
                  ratio *= 0.01;
               }

               return ratio;
            });

            // If not array:
         } else {
            // If not defined or 0.
            if (!percentage) {
               // Intersection (for better browser support) is being checked like
               // `if (entry.isIntersecting || entry.intersectionRatio >= this.ratio)`.
               // In case the ratio is 0, `entry.intersectionRatio >= this.ratio` for
               // non-intersecting elements, will be true.
               // Therefore:
               percentage = 0.0001;
            } else {
               // Get the proper value.
               percentage *= 0.01;
            }
         }

         return percentage;
      };

      // By default, the vewport is the intersection area.
      // This is used when an intersection between two elements in a page
      // has to be detected.
      // `this.area` is the element whose position creates (with rootMargin)
      // the area in the vewport, which is used as intersection observer's
      // root area.
      // This means the real root is allways the viewport.
      this.area = (root && document.querySelector(root)) || null; // intersection area
      this.targets = document.querySelectorAll(targets); // intersection targets
      this.callback = callback;
      this.unobserve = unobserve; // unobserve after intersection
      this.margins; // rootMargin for observer
      this.windowW = document.documentElement.clientWidth;
      this.windowH = document.documentElement.clientHeight;
      this.ratio = getRatio();

      // If root is selected, use its position to create margins,
      // else no margins (viewport as root).
      if (this.area) {
         // intersection area
         this.iArea = this.area.getBoundingClientRect();
         this.margins = `-${this.iArea.top}px -${
            this.windowW - this.iArea.right
         }px -${this.windowH - this.iArea.bottom}px -${this.iArea.left}px`;
      } else {
         this.margins = '0px';
      }

      // Keep this last (this.ratio has to be defined before).
      if (this.targets) {
         window.addEventListener('resize', () => this.resetObserver());
         this.resetObserver();
      }
   }

   resetObserver() {
      if (this.observer) this.observer.disconnect();

      const options = {
         root: this.area, // null for viewport
         rootMargin: this.margins,
         threshold: this.ratio,
      };

      this.observer = new IntersectionObserver(
         entries => this.observerCallback(entries, options),
         options,
      );

      return this.targets.forEach(target => this.observer.observe(target));
   }

   observerCallback(entries, options) {
      entries.forEach(entry => {
         // `entry.intersectionRatio >= this.ratio` for older browsers
         if (entry.isIntersecting || entry.intersectionRatio >= this.ratio) {
            if (this.callback) {
               // callback when visible
               this.callback(entry, options);
            }

            // unobserve
            if (this.unobserve) {
               this.observer.unobserve(entry.target);
            }
         } else {
            if (this.callback) {
               // callback when hidden
               this.callback(entry, options);
            }

            // No unobserve, because all invisible targets will be unobserved automatically.
         }
      });

      return;
   }
}
