const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanCSSPlugin = require('less-plugin-clean-css')

const vueLoaderConfig = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'

const publicPath = isDev ? '/public/' : 'auto'


const cssLoaderConfig = require('./css-loader.config')

// merge css-loader
const mergeCSSLoader = beforeLoader => {
  const loader = [
    // 这里匹配 `<style module>`
    {
      resourceQuery: /module/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: false,
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
            esModule: false,
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
        oneOf: mergeCSSLoader(),
      },
      {
        test: /\.less$/,
        oneOf: mergeCSSLoader({
          loader: 'less-loader',
          options: {
            sourceMap: true,
            lessOptions: {
              plugins: [
                new CleanCSSPlugin({ advanced: true }),
              ],
            },
          },
        }),
      },
      {
        test: /\.styl$/,
        oneOf: mergeCSSLoader({
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
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'imgs/[name]-[contenthash:8][ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'media/[name]-[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
        generator: {
          filename: 'fonts/[name]-[contenthash:8][ext]',
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
