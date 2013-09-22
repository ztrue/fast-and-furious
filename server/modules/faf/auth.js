var _ = require('_');

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
  if (!users.userId) {
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
   * @todo Implement user delete
   */
  bind: function(socketId, userId) {
    var oldUserId = sockets[socketId];

    if (oldUserId) {
      users[oldUserId].socketIds = _(users[oldUserId].socketIds).without(socketId);
    }

    if (userId) {
      addUser(userId);
      sockets[socketId] = userId;
      users[userId].socketIds.push(socketId);
    } else {
      delete sockets[socketId];
    }
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
   */
  setBySocketId: function(socketId, key, value) {
    this.set(this.getUserId(socketId), key, value);
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
   */
  setData: function(userId, data) {
    _(data).each(function(value, key) {
      this.set(userId, key, value);
    }.bind(this));
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
   */
  setDataBySocketId: function(socketId, data) {
    this.setData(this.getUserId(socketId), data);
  }
};
