// node 内置模块
const path = require('path')
const webpack = require('webpack')
// 生成html模版
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBroswerPlugin = require('open-browser-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/index.js',

  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js', // 指定分离出来的代码文件的名称
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/' // 解释： https://juejin.im/post/5ae9ae5e518825672f19b094
  },

  devServer: {
    hot: true,
    port: '3000',
    publicPath: '/',
    historyApiFallback: true, // 任何404响应都会替换成index.html (使用html5 history API时 可以防止刷新后404)
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
            loader: 'style-loader',
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
          }
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Are you ok?',
      template: path.resolve(__dirname, 'src/assets/template/template.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new OpenBroswerPlugin(),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
    ],

    // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
    // 其他文件可以在编码时指定后缀，如 import('./index.scss')
    extensions: [".js"],

    // 避免新增默认文件，编码时使用详细的文件路径，代码会更容易解读，也有益于提高构建速度
    mainFiles: ['index'],
  },
  // 优化部分
  optimization: {
    minimize: false,

    // 提取公共模块
    splitChunks: {
      chunks: 'all', // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
      cacheGroups: {
        // js提取
        reactBase: {
          name: 'reactBase',
          test: (module) => {
            return /react|redux|prop-types/.test(module.context);
          },
          chunks: 'initial',
          priority: 10,
        },
        common: {
          name: 'common',
          chunks: 'initial',
          priority: 2,
          minChunks: 2,
        },
        // css 提取
        styles: {
          name: 'styles',
          test: /\.(post)?css$/,
          chunks: 'all',
          enforce: true,
          priority: 20,
        }
      }
    }
  },
}
