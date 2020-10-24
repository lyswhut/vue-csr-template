const webpack = require('webpack')
const { merge } = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const baseConfig = require('./webpack.config.base')

const devServer = {
  port: 3000,
  host: '0.0.0.0',
  overlay: {
    errors: true,
  },
  historyApiFallback: {
    index: '/public/index.html',
  },
  quiet: true,
  clientLogLevel: 'warning',
  hot: true,
}

module.exports = merge(baseConfig, {
  devtool: '#cheap-module-eval-source-map',
  output: {
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:' + devServer.port],
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  devServer,
  performance: {
    hints: false,
  },
})
