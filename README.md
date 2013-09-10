# Fast and Furious

Node.js framework for rapid development of real-time single-page web applications.

## Quick Start

### Install

```sh
$ npm install faf
```

### Directory Structure

```
your-app/
  |- client/
  |- server/
  |  |- configs/
  |  |  |- env.local.js
  |  |- controllers/
  |  |  |- chat.js
  |  |  |- ...
  |- index.js
```

### Usage

```js
// index.js

require('faf').run();
```

```js
// server/controllers/chat.js

var messages = [];

module.exports = {
  clientEmitters: {
    updateMessages: function(emitter, data) {}
  },

  clientListeners: {
    // new user connected
    connection: function(socket) {
      // update messages for him only
      this.client.updateMessages(socket, messages);
    },
    // user send message
    sendMessage: function(socket, message) {
      // add this message to list
      messages.push(message);
      // update messages for all users
      this.client.updateMessages(null, messages);
    }
  }
};
```
