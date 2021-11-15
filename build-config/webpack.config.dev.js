const webpack = require('webpack')
const { merge } = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const baseConfig = require('./webpack.config.base')

const devServer = {
  port: 3000,
  // host: '0.0.0.0',
  client: {
    overlay: {
      errors: true,
    },
    logging: 'warn',
    progress: true,
  },
  historyApiFallback: {
    index: '/public/index.html',
  },
  hot: true,
}

module.exports = merge(baseConfig, {
  devtool: 'cheap-source-map',
  output: {
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: ['You application is running here http://localhost:' + devServer.port],
      },
    }),
  ],
  optimization: {
    emitOnErrors: false,
  },
  devServer,
  performance: {
    hints: false,
  },
})
