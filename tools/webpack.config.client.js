const baseConfig = require('./webpack.config.base');

module.exports = Object.assign({}, baseConfig, {
  entry: {
    client: './src/client/index.js',
  },
});
