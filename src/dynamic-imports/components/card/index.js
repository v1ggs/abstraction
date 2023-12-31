import './_index.scss';
import bgdImg from './pexels-luckee-bains-19438298-bgd.jpg';

export default () => {
   const cardSection = document.getElementsByClassName('section--card')[0];
   const card = `<article class="card">
   <header class="card__header">
      <figure class="card__thumbnail">
         <img src="${bgdImg}" alt="Thumbnail" class="card__image">
      </figure>
      <h2 class="card__title">Card Title</h2>
   </header>
   <section class="card__content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem tempore, consequatur soluta earum quas molestias dolore nobis, natus fuga iusto mollitia vel. Modi repellat eaque rem sint necessitatibus, aliquid hic! Culpa ipsum cum sint sit earum! Tempore, tenetur sapiente sit saepe libero voluptas necessitatibus unde porro, labore eos itaque a quasi quisquam autem. Sapiente atque quos repellat optio, officiis culpa. Repudiandae nulla expedita iusto, tempore nemo at commodi facere, perspiciatis perferendis minima eaque dolores quam asperiores sed, exercitationem ab. Dolores illo qui perferendis deleniti error, harum ut distinctio sapiente dolorem?</section>
   <footer class="card__footer">Card Footer</footer>
</article>`;
   return (cardSection.innerHTML = card);
};
