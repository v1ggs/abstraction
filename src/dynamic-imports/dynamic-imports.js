import isSupported from './intersection-observer/intersection-observer-test';
import IntersectionObserver from './intersection-observer/intersection-observer';
import './dynamic-imports.scss';

const main = async () => {
   if (isSupported()) {
      console.log('loadcard');
      loadCardOnDemand();
   } else {
      console.log('polyfill & loadcard');
      polyfillOnDemand();
      loadCardOnDemand();
   }

   if (!PRODUCTION) {
      import(
         /* webpackChunkName: "chunk-console-log", webpackPreload: true */ './components/console/log.js'
      ).then(({ default: clog }) => {
         clog();
      });
   }
};

const loadCard = async (entry, options) => {
   console.log(entry);
   console.log(options);

   const cardParent = document.getElementsByClassName('section--card')[0];
   const cardElement = cardParent.getElementsByClassName('card')[0];

   cardParent.style.height = `${document.documentElement.clientHeight}px`;

   const { default: card } = await import(
      /* webpackChunkName: "chunk-card", webpackPrefetch: true */ './components/card/index'
   );

   if (entry.isIntersecting) {
      card();
      document.documentElement.classList.add('card-is-visible');
   }

   if (cardElement && !entry.isIntersecting) {
      cardElement.remove();
      document.documentElement.classList.remove('card-is-visible');
   }
};

const polyfillOnDemand = async () => {
   const { default: ioPolyfill } = await import(
      /* webpackChunkName: "chunk-io-polyfill", webpackPrefetch: true */
      './intersection-observer/intersection-observer-polyfill'
   );

   return ioPolyfill();
};

const loadCardOnDemand = async () => {
   return new IntersectionObserver({
      targets: '.section--card',
      percentage: [80],
      callback: loadCard,
      // unobserve: true,
   });
};

if (document.title === 'Dynamic Imports') {
   main();
}
