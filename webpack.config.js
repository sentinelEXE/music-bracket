const fs = require('fs');
const path = require('path');

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'server.crt')),
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      return middlewares;
    },
  },
};