// node 内置模块
const path = require('path')
const webpack = require('webpack')
// css 压缩 (直接使用 minimize: true 在匹配到css后直接压缩, 项目是用了autoprefix自动添加前缀，这样压缩，会导致添加的前缀丢失)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
// 生成html模版
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 显示打包进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js', // 指定分离出来的代码文件的名称
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/' // 解释： https://juejin.im/post/5ae9ae5e518825672f19b094
  },

  devServer: {
    hot: true,
    publicPath: '/',
    proxy: {
      '/api': {
        target: "http://10.0.0.130:8555", // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
        compress: true,
        pathRewrite: {'^/api': ''}, // 把 URL 中 path 部分的 `api` 移除掉
      },
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        // exclude: /node_modules/,
        exclude: [
          path.resolve(__dirname, 'src/assets/icons'), // 使用svg-sprite-loader注意： 一定要将使用该loader排除掉
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name].[hash:7].[ext]',
              outputPath: 'images',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        // 处理svg图标 svg-sprite-loader会把你的icon塞到一个个symbol中，symbol的id如果不特别指定，就是你的文件名。它最终会在你的html中嵌入这样一个svg
        test: /.*\.svg$/i,
        include: [path.resolve(__dirname, 'src/assets/icons')],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩svg
              svgo: {},
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name]_[id].css',
    }),
    new HtmlWebpackPlugin({
      title: 'Are you ok?',
      template: path.resolve(__dirname, 'src/assets/template/template.html'),
    }),
    // new OptimizeCSSAssetsPlugin({
    //   assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
    //   cssProcessor: cssnano,
    //   cssProcessorOptions: {
    //     discardComments: { removeAll: true },
    //     // 避免 cssnano 重新计算 z-index
    //     safe: true,
    //     // cssnano 集成了autoprefixer的功能
    //     // 会使用到autoprefixer进行无关前缀的清理
    //     // 关闭autoprefixer功能
    //     // 使用postcss的autoprefixer功能
    //     autoprefixer: false,
    //   },
    //   canPrint: true,
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin({
      format: '  build [:bar] :percent (:elapsed seconds)',
      clear: false,
      width: 60,
    }),
  ],
}
