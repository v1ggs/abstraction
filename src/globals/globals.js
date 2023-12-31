import './_globals.scss';
const main = () => {
   console.log('REM_SIZE: ' + REM_SIZE);
   console.log('DESIGN: ' + DESIGN);
   console.log('PUBLIC_PATH: ' + PUBLIC_PATH);
   // console.log('DISPLAY (user): ' + G_DISPLAY);
   // console.log('BLOCK (user): ' + G_BLOCK);

   if (!PRODUCTION) {
      console.log('This is NOT production.');
   }

   if (ENV_MAIN) {
      console.log('This is main bundle.');
   }

   if (ENV_LEGACY) {
      console.log('Differential serving enabled.');
      console.log('This is legacy/es5 bundle.');
   }
};

if (document.title === 'Globals') {
   main();
}
