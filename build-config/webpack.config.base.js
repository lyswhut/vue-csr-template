const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const vueLoaderConfig = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

const publicPath = isDev ? '/public/' : '/'


const cssLoaderConfig = require('./css-loader.config')

function cssLoaderMerge(beforeLoader) {
  const loader = [
    // 这里匹配 `<style module>`
    {
      resourceQuery: /module/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
          },
        },
        {
          loader: 'css-loader',
          options: cssLoaderConfig,
        },
        'postcss-loader',
      ],
    },
    // 这里匹配普通的 `<style>` 或 `<style scoped>`
    {
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDev,
          },
        },
        'css-loader',
        'postcss-loader',
      ],
    },
  ]
  if (beforeLoader) {
    loader[0].use.push(beforeLoader)
    loader[1].use.push(beforeLoader)
  }
  return loader
}

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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: isDev ? '[id].css' : '[id].[contenthash:8].css',
    }),
  ],
}
