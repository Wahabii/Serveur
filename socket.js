
let io;

module.exports = {
      init: httpServer => {
           io = require('socket.io')(httpServer, {
            cors: {
              origins: ['http://localhost:4200']
            }
          });
           return io;
      },
      getIo: () => {
          if (!io) {
              throw new Error('Socket.io not initialized!');
          }
          return io ;
      }
}