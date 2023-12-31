import { debounce, throttle } from 'lodash-es';

const init = () => {
   if (document.title === 'Tree Shaking') {
      window.addEventListener('load', () => {
         let i = 1;
         document.body.style.height = '3000px';

         window.addEventListener(
            'scroll',
            debounce(() => {
               console.log('debounce');
            }, 500),
         );

         window.addEventListener(
            'scroll',
            throttle(() => {
               console.log(i++);
            }, 300),
         );
      });
   }
};

init();
