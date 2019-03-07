// node 内置模块
const path = require('path')
const webpack = require('webpack')
// const os = require('os')
// const ossize = os.cpus().length
// css 压缩 (直接使用 minimize: true 在匹配到css后直接压缩, 项目是用了autoprefix自动添加前缀，这样压缩，会导致添加的前缀丢失)
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const cssnano = require('cssnano')
// 生成html模版
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 增强html-webpack-plugin (注入dll生成的基础库）也可以考虑放到html-webpack-plugin的模板中写dll的路径
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
// 显示打包进度
// const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// js 压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 复制文件
const CopyPlugin = require('copy-webpack-plugin')
// 添加缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
  entry: './src/index.jsx',

  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js', // 指定分离出来的代码文件的名称
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/' // 解释： https://juejin.im/post/5ae9ae5e518825672f19b094
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
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        include: [path.resolve(__dirname, 'src')],
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
      // 处理node_modules 中的css
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          {
            loader: 'css-loader',
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
      minify: {
        // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true, // 压缩 HTML 中出现的 JS 代码
      },
    }),
    new webpack.DllReferencePlugin({
      manifest: require('./public/vendor.manifest.json'),
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['./static/vendor.dll.js'], // 添加的资源相对html的路径
      append: false, // false 在其他资源的之前添加 true 在其他资源之后添加
      hash: false,
    }),
    new CopyPlugin([
      {from: path.resolve(__dirname, 'public', 'vendor.dll.js'), to: path.resolve(__dirname, 'dist', 'static')}, // 复制dll文件到dist
    ]),
    new HardSourceWebpackPlugin(),
    // new ProgressBarPlugin({
    //   format: '  build [:bar] :percent (:elapsed seconds)',
    //   clear: false,
    //   width: 60,
    // }),
  ],
  // 优化部分
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)/g, //注意不要写成 /\.css$/g
        cssProcessor: cssnano,
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          // 避免 cssnano 重新计算 z-index
          safe: true,
          // cssnano 集成了autoprefixer的功能
          // 会使用到autoprefixer进行无关前缀的清理
          // 关闭autoprefixer功能
          // 使用postcss的autoprefixer功能
          autoprefixer: false,
        },
        canPrint: true,
      }),
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true, // 删除console
          }
        }
      }),
    ],

    // 提取公共模块
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'initial',
          priority: 2,
          minChunks: 2,
        },
        // css 提取
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          priority: 20,
        },
      },
    },
  },
  // 处理解析
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
    ],

    // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
    // 其他文件可以在编码时指定后缀，如 import('./index.scss')
    extensions: ['.js', '.jsx'],

    // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度 （默认就是index）
    mainFiles: ['index'],
  },
}
