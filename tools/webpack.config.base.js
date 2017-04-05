const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

// Allow webpack tree shaking by disabling babel modules
const babelOptions = (() => {
  let babelrc = fs.readFileSync(path.resolve(__dirname, '../.babelrc'), { encoding: 'utf8' });
  babelrc = JSON.parse(babelrc);
  return Object.assign({}, {
    presets: babelrc.presets.map(preset => (
      preset === 'env' ? ['env', { modules: false }] : preset
    )),
  });
})();
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
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
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
