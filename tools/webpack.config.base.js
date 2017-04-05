const path = require('path');
const nodeExternals = require('webpack-node-externals');

const projectRoot = path.resolve(__dirname, '..');

module.exports = {
  context: projectRoot,

  output: {
    path: projectRoot,
    filename: '[name].js',
    library: 'api',
    libraryTarget: 'commonjs2',
  },

  externals: [nodeExternals()],
};
