const fs = require('fs').promises;

const text = 'Rocket jump? That sounds dangerous!';

fs.writeFile('voiceline.txt', text)
  .then(() => {
    console.log('Success!');
  })
  .catch((err) => {
    console.log('Fail!', err);
  });
