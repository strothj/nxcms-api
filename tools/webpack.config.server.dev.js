const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

const baseConfig = require('./webpack.config.server');

module.exports = Object.assign({}, baseConfig, {
  entry: [
    'webpack/hot/poll?1000',
    './src/dev-server',
  ],

  watch: true,

  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000'],
  })],

  plugins: [
    ...baseConfig.plugins,
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  output: {
    path: path.resolve(__dirname, '../.build'),
    filename: 'server.js',
  },
});
