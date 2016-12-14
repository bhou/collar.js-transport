const Transport = require('./Transport');
const EventEmitter = require("eventemitter3");

class LocalTransport extends Transport {
  constructor(name, options) {
    super(options);
    this.name = name;
  }

  getId() {
    return this.name;
  }

  handleOutgoingSignal(signal, done) {
    LocalTransport.ee.emit('signal-' + this.name, signal, done);
  }

  listen(send) {
    LocalTransport.ee.on('signal-' + this.name, (signal, done) => {
      let ctx = {
        respond: done
      }
      send(ctx, signal);
    });
  }

  handleResponseSignal(ctx, signal, done) {
    if (!ctx) {
      return; // do nothing
    }
    let respond = ctx.respond;
    if (!respond) {
      return done(new Error('Can not find the request object for signal: ' + signal.id));
    }
    
    try {
      if (signal.error) {
        respond(signal.error);
      } else {
        respond(null, signal.payload);
      }
    } catch (e) {
      return done(e);
    }
    
    done();
  }
}

LocalTransport.ee = new EventEmitter();

module.exports = LocalTransport;
