const webpack = require('webpack')
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const cssLoaderConfig = require('./css-loader.config')

function cssLoaderMerge(beforeLoader) {
  const loader = [
    // 这里匹配 `<style module>`
    {
      resourceQuery: /module/,
      use: [
        MiniCssExtractPlugin.loader,
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
        MiniCssExtractPlugin.loader,
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

module.exports = merge(baseConfig, {
  output: {
    filename: '[name].[chunkhash:8].js',
  },
  devtool: false,
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contentHash:8].css',
      chunkFilename: '[id].[contentHash:8].css',
    }),
    new webpack.NamedChunksPlugin(),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      cacheGroups: {
        // chunks: 'all',
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },
  performance: {
    hints: 'warning',
  },
})
