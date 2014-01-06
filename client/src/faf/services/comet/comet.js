/**
 * Comet via socket.io
 */
angular
  .module('faf.comet', [])
  .factory('$comet', function($rootScope) {
    /**
     * Connected socket
     * @type {?Socket}
     */
    var socket = null;

    /**
     * Event handler or callback wrapper
     * @param {function(data)} callback Original handler or callback
     * @param {...*} var_args Event data
     */
    var handler = function(callback, var_args) {
      callback.apply(this, Array.prototype.slice.call(arguments, 1));
      $rootScope.$digest();
    };

    /**
     * Not connected error
     */
    var notConnected = function() {
      console.error('Socket not connected');
    };

    return {
      /**
       * Connect to server
       * @returns {this}
       */
      connect: function() {
        if (socket === null) {
          socket = io.connect();
        }

        return this;
      },

      /**
       * Listen
       * @param {Array.<string>|string} events Events names
       * @param {function(Object)} callback Event handler
       * @param {string} opt_scope Scope
       * @returns {this}
       */
      on: function(events, callback, opt_scope) {
        if (!angular.isArray(events)) {
          events = [events];
        }

        if (socket !== null) {
          angular.forEach(events, function(event) {
            var listener = handler.bind(this, callback);

            socket.on(event, listener);

            // unbind listener on scope destroy
            if (opt_scope) {
              opt_scope.$on('$destroy', function() {
                socket.removeListener(event, listener);
              }.bind(this));
            }
          }.bind(this));
        } else {
          notConnected();
        }

        return this;
      },

      /**
       * Send event
       * @param {string} event Event name
       * @param {...*} var_args Event data
       * @param {function(...*)=} opt_callback Event callback
       * @returns {this}
       */
      emit: function(event, var_args, opt_callback) {
        if (socket !== null) {
          // wrap callback
          if (arguments.length > 0) {
            var lastArgument = arguments[arguments.length - 1];

            if (angular.isFunction(lastArgument)) {
              arguments[arguments.length - 1] = handler.bind(this, lastArgument);
            }
          }

          socket.emit.apply(socket, arguments);
        } else {
          notConnected();
        }

        return this;
      }
    };
  });
