import './images.scss';
import star from './svg/star.svg';
import commentDots from './svg/comment-dots.svg';

const main = () => {
   const starSvg = document.createElement('div');
   const commentDotsSvg = document.createElement('div');
   starSvg.className = 'dynamic-svg';
   commentDotsSvg.className = 'dynamic-svg';

   starSvg.innerHTML = `<svg id="${star.id}" class="svgIconJS" ${star.viewBox}>
      <!-- url contains id -->
      <use xlink:href="${star.url}"></use>
   </svg>`;

   commentDotsSvg.innerHTML = `<svg id="${commentDots.id}" class="svgIconJS" ${commentDots.viewBox}>
      <use xlink:href="${commentDots.url}"></use>
   </svg>`;

   console.log(star);
   console.log(commentDots);

   window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(starSvg);
      document.body.appendChild(commentDotsSvg);
   });
};

if (document.title === 'Images') {
   main();
}
