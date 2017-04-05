const path = require('path');
const webpack = require('webpack');
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

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      regeneratorRuntime: 'regenerator-runtime',
    }),
  ],

  externals: [nodeExternals()],
};
