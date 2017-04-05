const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,

  entry: {
    client: './src/client/index.js',
    server: './src/server/index.js',
  },

  output: {
    path: __dirname,
    filename: '[name].js',
    library: 'api',
    libraryTarget: 'commonjs2',
  },

  target: 'node',

  externals: [nodeExternals()],
};
