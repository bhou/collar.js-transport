/**
 * Transport delegator used for 3rd party provider to provide different transport
 */
class Transport {
  constructor(options = {}) {
    this.options = options;
    this._cache = new Map();
    this._cacheSize = options.cacheSize || 20;
    this._cacheTimeout = options.cacheTimeout || 5000; // default timeout 5 s
  }

  //-----------------------------------
  // To be inherited from subclass
  //-----------------------------------
  /**
   * Used to check if two transports is identical
   * Note: it is possible two transport instance returns the same id, 
   * the idea here is to link such transport together
   * @return the unique identifier for this transport
   */
  getId() {return null}

  /**
   * for sending outgoing message (request)
   * @signal  Signal, the signal to be sent
   * @done    Function, fn(error, result), the result of the request
   */
  handleOutgoingSignal(signal, done) {}

  /**
   * for handlingincoming message, convert the transport message to signal
   * @send  Function, fn(ctx, signal), send the signal to downstream
   *
   * the ctx object in send function is an object, you can put any data in it,
   * and it will be retrieved and passed to response handler
   * see @handleResponseSignal
   */
  listen(send) {}

  /**
   * for sending response message
   * @ctx  Object, the context object, it contains at least two properties:
   *  - timestamp: when the request is received
   *  - signal: the request signal
   * @signal  Signal, the response signal
   * @done    Function: fn(error, result), call this when response is done/has error
   */
  handleResponseSignal(ctx, signal, done) {}


  //------------------------------------
  // getter / setter
  //------------------------------------
  get cacheSize() {
    return this._cacheSize;
  }

  get cacheTimeout() {
    return this._cacheTimeout;
  }
  
  set cacheSize(size) {
    this._cacheSize = size;
  }

  set cacheTimeout(timeout) {
    this._cacheTimeout = timeout;
  }

  getContext(signal) {
    if (!signal || !signal.id) return null;
    return this._cache.get(signal.id);
  }

  //------------------------------------
  // private methods
  //------------------------------------
  saveContext(context, signal) {
    this.cleanupSignalCache();

    let ctx = context;
    if (!ctx) ctx = {};
    ctx.signal = signal;
    ctx.timestamp = new Date().getTime();
    
    this._cache.set(signal.id, ctx);
  }

  cleanupSignalCache(force = false) {
    if (this._cache.size > this._cacheSize || force) {
      let now = new Date().getTime();
      for (let id of this._cache.keys()) {
        if (this._cache.get(id).timestamp + this._cacheTimeout < now) {
          this._cache.delete(id);
        }
      }
    }
  }
}

module.exports = Transport;
