var _ = require('underscore');
var express = require('express');
var socketIo = require('socket.io');

module.exports = {
  /**
   * Start web server
   * @param {Object} serverConfig Server config
   * @param {Array.<Object>} controllers Controllers
   * @param {function()=} opt_callback Callback on server started
   */
  start: function(serverConfig, controllers, opt_callback) {
    var app = express();

    // add logger if needed
    if (serverConfig.logger) {
      app.use(express.logger(serverConfig.LOGGER));
    }

    // add public dir for static files
    app.use(express.static(serverConfig.PUBLIC));

    // init server
    var httpServer = app.listen(serverConfig.PORT);

    // init sockets
    var io = socketIo.listen(httpServer);

    // init controllers
    _(controllers).each(function(controller) {
      controller.bootstrap(io.sockets);
    });

    // TODO callback on controllers bootstrap
    if (opt_callback) {
      opt_callback.call(this);
    }

    console.log('Server started at port ' + serverConfig.PORT);
  }
};
