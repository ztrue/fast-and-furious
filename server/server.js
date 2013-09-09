var _ = require('underscore');
var express = require('express');
var socketIo = require('socket.io');

module.exports = {
  /**
   * Start web server
   * @param {Array.<Object>} controllers Controllers
   */
  start: function(controllers) {
    // server config
    var config = faf.config('server');

    var app = express();

    // add logger if needed
    if (config.logger) {
      app.use(express.logger(config.LOGGER));
    }

    // add public dir for static files
    app.use(express.static(config.PUBLIC));

    // init server
    var httpServer = app.listen(config.PORT);

    // init sockets
    var io = socketIo.listen(httpServer);

    // init controllers
    _(controllers).each(function(controller) {
      controller.bootstrap(io.sockets);
    });

    console.log('Server started at port ' + config.PORT);
  }
};
