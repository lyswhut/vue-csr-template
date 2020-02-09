const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const vueLoaderConfig = require('./vue-loader.config')

const publicPath = '/public/'

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'web',
  entry: path.join(__dirname, '../src/main.js'),
  output: {
    path: path.join(__dirname, '../public'),
    publicPath,
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-formatter-friendly'),
        },
        exclude: /node_modules/,
        enforce: 'pre',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          publicPath,
          name: '[name].[ext]?[hash:8]',
          esModule: false,
        },
      },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          fallback: 'file-loader',
          outputPath: 'img/',
          name: '[name].[ext]?[hash:8]',
          esModule: false,
        },
      },
    ],
  },
  performance: {
    maxEntrypointSize: 300000,
  },
  plugins: [
    new VueLoaderPlugin(),
    new HTMLPlugin({
      template: path.join(__dirname, './template.html'),
    }),
  ],
}
