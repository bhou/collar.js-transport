const Transport = require('./Transport');

if (!window.__collar__) {
  console.error('Must include collar.js before collar.js-transport!!');
} else {
  window.__collar__.Transport = Transport;
}
