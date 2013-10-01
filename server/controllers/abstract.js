var eventEmitter = new (require('events').EventEmitter)();
var _ = require('underscore');

module.exports = {
  /**
   * Sockets
   * @type {Object}
   */
  sockets: null,

  /**
   * Client emitters getter
   * @type {Object.<string, function(Object=, Object=)>}
   */
  client: {},

  /**
   * Server emitters getter
   * @type {Object.<string, function(Object=)>}
   */
  server: {},

  /**
   * Client emitters declaration
   * @type {Object.<string, function()>}
   */
  clientEmitters: {},

  /**
   * Client listeners declaration
   * @type {Object.<string, function(Object, Object=, function(?string=, Object=))>}
   */
  clientListeners: {},

  /**
   * Server emitters declaration
   * @type {Object.<string, function()>}
   */
  serverEmitters: {},

  /**
   * Server listeners declaration
   * @type {Object.<string, function(Object=)>}
   */
  serverListeners: {},

  /**
   * Controller bootstrap
   * @param {Object} sockets Sockets
   */
  bootstrap: function(sockets) {
    this.sockets = sockets;
    this.initClientEmitters();
    this.sockets.on('connection', this.initClientListeners.bind(this));
    this.initServerEmitters();
    this.initServerListeners();
    this.init();
  },

  /**
   * Init client events emitters
   */
  initClientEmitters: function() {
    // TODO use fn
    _(this.clientEmitters).each(function(fn, event) {
      this.client[event] = this.clientEmit.bind(this, event);
    }.bind(this));
  },

  /**
   * Init client events listeners
   * Listeners added when client connect
   */
  initClientListeners: function(socket) {
    _(this.clientListeners).each(function(listener, event) {
      socket.on(event, function() {
        var args = _(arguments).toArray();
        var callback = _(args).last();
        if (_(callback).isFunction()) {
          args = args.slice(0, args.length - 1);
        } else {
          callback = function() {};
        }
        listener.apply(this, _.union(socket, callback, args));
      }.bind(this));
    }.bind(this));

    // run connection listener
    if (this.clientListeners.connection) {
      this.clientListeners.connection.call(this, socket);
    }
  },

  /**
   * Init server events emitters
   */
  initServerEmitters: function() {
    // TODO use fn
    _(this.serverEmitters).each(function(fn, event) {
      this.server[event] = this.serverEmit.bind(this, event);
    }.bind(this));
  },

  /**
   * Init server events listeners
   */
  initServerListeners: function() {
    _(this.serverListeners).each(function(listener, event) {
      eventEmitter.on(event, function() {
        listener.apply(this, arguments);
      }.bind(this));
    }.bind(this));
  },

  /**
   * Emit event to client
   * @param {string} event Event name
   * @param {Object=} opt_emitter Emitter (sockets|socket|socket.broadcast)
   * @param {Object=} opt_data Event data
   * @todo Any data arguments
   */
  clientEmit: function(event, opt_emitter, opt_data) {
    // set default emitter (to all clients) if not passed
    opt_emitter = opt_emitter || this.sockets;
    opt_emitter.emit(event, opt_data);
  },

  /**
   * Emit event to server
   * @param {string} event Event name
   * @param {...*} var_args Event data
   */
  serverEmit: function(event, var_args) {
    eventEmitter.emit.apply(eventEmitter, arguments);
  },

  /**
   * Get socket by socket ID
   * @param {string} socketId Socket ID
   * @returns {Object} Socket
   */
  getSocket: function(socketId) {
    return this.sockets.sockets[socketId];
  },

  /**
   * Controller init (at the end of the bootstrap)
   */
  init: function() {}
};
