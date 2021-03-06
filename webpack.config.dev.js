// node 内置模块
const path = require('path')
const webpack = require('webpack')
// 生成html模版
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBroswerPlugin = require('open-browser-webpack-plugin')
// 增强html-webpack-plugin (注入dll生成的基础库）也可以考虑放到html-webpack-plugin的模板中写dll的路径
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
// 添加缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/index.jsx',

  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js', // 指定分离出来的代码文件的名称
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/' // 解释： https://juejin.im/post/5ae9ae5e518825672f19b094
  },

  devServer: {
    // http://localhost:8080/webpack-dev-server 可以看见资源的路径
    hot: true,
    port: '3000',
    publicPath: '/', // webpack-dev-server打包的内容是放在内存中的，这些打包后的资源对外的的根目录（打包后资源存放的位置）
    // 设置contentbase 来加载dll中的内容
    contentBase: [path.resolve(__dirname, 'public')], // 静态资源位置
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
      // 处理node_modules 中的css
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          }
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
    new webpack.DllReferencePlugin({
      manifest: require('./public/vendor.manifest.json'),
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['./vendor.dll.js'], // 添加的资源相对html的路径 （由于配置contentBase为public 所以路径可以直接获取）
      append: false, // false 在其他资源的之前添加 true 在其他资源之后添加
      hash: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HardSourceWebpackPlugin(),
    new OpenBroswerPlugin({
      url: 'http://localhost:3000',
    }),
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'), // 使用绝对路径指定 node_modules，不做过多查询
    ],

    // 删除不必要的后缀自动补全，少了文件后缀的自动匹配，即减少了文件路径查询的工作
    // 其他文件可以在编码时指定后缀，如 import('./index.scss')
    extensions: ['.js', '.jsx'],

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
          priority: 20, // 权重 越大优先级越高
        }
      }
    }
  },
}
