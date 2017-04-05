const baseConfig = require('./webpack.config.base');

module.exports = Object.assign({}, baseConfig, {
  entry: {
    server: './src/server/index.js',
  },
});
