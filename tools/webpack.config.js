/* eslint-disable comma-dangle, no-use-before-define, global-require */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const projectRoot = path.resolve(__dirname, '..');

module.exports = (env = {}) => {
  const isDevMode = env.development === true;

  return {
    context: projectRoot,

    entry: isDevMode ? ['webpack/hot/poll?1000', './src/index.js'] : './src/index.js',

    output: {
      filename: 'server.bundle.js',
      path: isDevMode ? path.join(projectRoot, '.build') : path.join(projectRoot, 'dist'),
      pathinfo: isDevMode
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: babelConfigWithTreeShaking(),
        },
        ...devESLintValidation(isDevMode)
      ],
    },

    plugins: [
      new webpack.ProvidePlugin({
        regeneratorRuntime: 'regenerator-runtime'
      }),
      ...devHMRPlugins(isDevMode)
    ],

    devtool: isDevMode ? 'eval-source-map' : 'source-map',

    target: 'node',

    watch: isDevMode,

    externals: isDevMode ? [nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    })] : [nodeExternals()]
  };
};

const babelConfigWithTreeShaking = () => {
  const babelConfig = JSON.parse(
    fs.readFileSync(path.join(projectRoot, '.babelrc'), { encoding: 'utf8' })
  );
  babelConfig.babelrc = false;
  babelConfig.presets = babelConfig.presets.map(preset => (
    preset === 'env' ? ['env', { modules: false }] : preset
  ));
  return babelConfig;
};

const devESLintValidation = (isDevMode) => (
  isDevMode ? [
    {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }
  ] : []
);

const devHMRPlugins = (isDevMode) => {
  if (!isDevMode) return [];

  const StartServerPlugin = require('start-server-webpack-plugin');
  return [
    new StartServerPlugin('server.bundle.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ];
};
