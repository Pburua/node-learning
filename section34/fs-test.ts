
const text = 'Rocket jump? That sounds dangerous!';

const encoder = new TextEncoder();
const data = encoder.encode(text);

Deno.writeFile('voiceline.txt', data)
  .then(() => {
    console.log('Success!');
  })
  .catch((err) => {
    console.log('Fail!', err);
  });
