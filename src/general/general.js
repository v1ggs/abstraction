import { obj1, obj2 } from './js/import-obj';
import text from './js/import-text';
import './general.scss';

const init = () => {
   window.addEventListener('DOMContentLoaded', () => {
      // Enable scrolling
      document.body.style.height = '3000px';
   });

   console.log(text);
   mergeObj('newObj-');
};

const mergeObj = replacement => {
   const newObj = Object.assign({}, obj1, obj2);

   const arrReplaced = Object.values(newObj).map(value => {
      return value.replace('obj', replacement);
   });

   console.log('obj1:');
   console.log(obj1);
   console.log('obj2:');
   console.log(obj2);
   console.log('newObj:');
   console.log(newObj);
   console.log('arrReplaced:');
   console.log(arrReplaced);
};

if (document.title === 'General') {
   init();
}
