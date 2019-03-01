// 第一次build或者基础库升级时 使用该配置生成依赖
const webpack = require('webpack')
const path = require('path')

const vendors = [
  'react',
  'react-dom',
  'react-router-dom',
  // 'axios',
]

module.exports = {
  entry: {
    vendor: vendors,
  },
  output: {
    filename: '[name].dll.js', // 动态链接库输出的文件名称
    path: path.join(__dirname, 'public'), // 动态链接库输出路径
    libraryTarget: 'var', // 链接库(react.dll.js)输出方式 默认'var'形式赋给变量 b
    library: '_dll_[name]_[hash:6]' // 全局变量名称 导出库将被以var的形式赋给这个全局变量 通过这个变量获取到里面模块
  },
  plugins: [
    new webpack.DllPlugin({
      // path 指定manifest文件的输出路径
      path: path.join(__dirname, 'public', '[name].manifest.json'),
      name: '_dll_[name]_[hash:6]', // 和library 一致，输出的manifest.json中的name值
    })
  ]
}
