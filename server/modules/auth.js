var _ = require('underscore');

/**
 * Map for socket ID / user ID
 * @type {Object.<string, string|number>}
 */
var sockets = {};

/**
 * Users data
 * @type {Object.<string, Object>}
 * @schema {
 *   data: Object.<string, *>,
 *   socketIds: Array.<string>,
 *   userId: string|number
 * }
 */
var users = {};

/**
 * Add user if it not exists
 * @param {string|number} userId User ID
 */
function addUser(userId) {
  if (!users[userId]) {
    users[userId] = {
      data: {},
      socketIds: [],
      userId: userId
    };
  }
}

module.exports = {
  /**
   * Bind socket ID to user ID
   * @param {string} socketId Socket ID
   * @param {string|number} userId User ID
   * @returns {auth} this
   * @todo Implement user delete
   */
  bind: function(socketId, userId) {
    var userIdOld = sockets[socketId];

    if (userIdOld) {
      users[userIdOld].socketIds = _(users[userIdOld].socketIds).without(socketId);
    }

    if (userId) {
      addUser(userId);
      sockets[socketId] = userId;
      users[userId].socketIds.push(socketId);
    } else {
      userId = sockets[socketId];
      if (userId) {
        delete sockets[socketId];
        if (users[userId].socketIds.length === 0) {
          delete users[userId];
        }
      }
    }

    return this;
  },

  /**
   * Remove user and unbind socket IDs
   * @param {number} userId User ID
   */
  remove: function(userId) {
    this.getSocketIds(userId).forEach(function(socketId) {
      delete sockets[socketId];
    });

    delete users[userId];
  },

  /**
   * Get sockets IDs for user
   * @param {string|number} userId
   * @returns {Array.<string>}
   */
  getSocketIds: function(userId) {
    return users[userId] ? users[userId].socketIds : [];
  },

  /**
   * Get user ID for socket
   * @param {string} socketId Socket ID
   * @returns {string|number|undefined}
   */
  getUserId: function(socketId) {
    return sockets[socketId];
  },

  /**
   * Check user exists
   * @param {string|number} userId User ID
   * @returns {boolean}
   */
  isUserExists: function(userId) {
    return users[userId] !== undefined;
  },

  /**
   * Get all users IDs
   * @returns {Array.<string|number>}
   */
  getUserIds: function() {
    return _(users).keys();
  },

  /**
   * Get user data by key
   * @param {string|number} userId User ID
   * @param {string} key Data key
   * @returns {*} Value
   */
  get: function(userId, key) {
    return users[userId] && users[userId].data[key];
  },

  /**
   * Set user data by key
   * @param {string|number} userId User ID
   * @param {string} key Data key
   * @param {*} value Value
   * @returns {auth} this
   */
  set: function(userId, key, value) {
    if (userId) {
      if (users[userId] && value === undefined) {
        delete users[userId][key];
      } else {
        addUser(userId);
        users[userId].data[key] = value;
      }
    }

    return this;
  },

  /**
   * Get user data by key by socket ID
   * @param {string} socketId Socket ID
   * @param {string} key Data key
   * @returns {*} Value
   */
  getBySocketId: function(socketId, key) {
    return this.get(this.getUserId(socketId), key);
  },

  /**
   * Set user data by key by socket ID
   * @param {string} socketId Socket ID
   * @param {string} key Data key
   * @param {*} value Value
   * @returns {auth} this
   */
  setBySocketId: function(socketId, key, value) {
    this.set(this.getUserId(socketId), key, value);

    return this;
  },

  /**
   * Get user data
   * @param {string|number} userId User ID
   * @returns {*} Data
   */
  getData: function(userId) {
    return users[userId] ? users[userId].data : {};
  },

  /**
   * Set user data
   * @param {string|number} userId User ID
   * @param {Object, <string, *>} data Data
   * @returns {auth} this
   */
  setData: function(userId, data) {
    _(data).each(function(value, key) {
      this.set(userId, key, value);
    }.bind(this));

    return this;
  },

  /**
   * Get user data by socket ID
   * @param {string|number} socketId Socket ID
   * @returns {*} Data
   */
  getDataBySocketId: function(socketId) {
    return this.getData(this.getUserId(socketId));
  },

  /**
   * Set user data by socket ID
   * @param {string|number} socketId Socket ID
   * @param {Object, <string, *>} data Data
   * @returns {auth} this
   */
  setDataBySocketId: function(socketId, data) {
    this.setData(this.getUserId(socketId), data);

    return this;
  }
};
