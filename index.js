//module.exports = require("./build/prod/node/collar-transport.min.latest.js");

const Transport = require('./Transport');
const LocalTransport = require('./LocalTransport');

module.exports = {
  Transport: Transport,
  LocalTransport: LocalTransport
}

