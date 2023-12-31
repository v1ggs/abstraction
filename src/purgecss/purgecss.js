import './purgecss.scss';

window.addEventListener('DOMContentLoaded', () => {
   if (document.title === 'Purge CSS') {
      const element = document.getElementsByClassName('add-with-js')[0];
      element.classList.add('js-keep-always');
   }
});
