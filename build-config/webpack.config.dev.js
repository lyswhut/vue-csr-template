const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const cssLoaderConfig = require('./css-loader.config')

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"',
    },
  }),
  new FriendlyErrorsPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
]

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

function cssLoaderMerge(beforeLoader) {
  const loader = [
    // 这里匹配 `<style module>`
    {
      resourceQuery: /module/,
      use: [
        'vue-style-loader',
        {
          loader: 'css-loader',
          options: Object.assign({
            sourceMap: true,
          }, cssLoaderConfig),
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    // 这里匹配普通的 `<style>` 或 `<style scoped>`
    {
      use: [
        'vue-style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ]
  if (beforeLoader) {
    loader[0].use.push(beforeLoader)
    loader[1].use.push(beforeLoader)
  }
  return loader
}

module.exports = merge(baseConfig, {
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        oneOf: cssLoaderMerge(),
      },
      {
        test: /\.less$/,
        oneOf: cssLoaderMerge({
          loader: 'less-loader',
          options: {
            sourceMap: true,
          },
        }),
      },
      {
        test: /\.styl$/,
        oneOf: cssLoaderMerge({
          loader: 'stylus-loader',
          options: {
            sourceMap: true,
          },
        }),
      },
    ],
  },
  plugins: defaultPlugins,
  devServer,
  performance: {
    hints: false,
  },
})
