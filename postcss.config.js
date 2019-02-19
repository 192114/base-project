const postcssPresetEnv = require('postcss-preset-env') // 允许使用未来的css特性
const pxtoviewport = require('postcss-px-to-viewport') // 根据设计稿将px转换成vm vh
const sprites = require('postcss-sprites') // 生成雪碧图 ===> 图标方案换为svg图标处理
const postcssWriteSvg = require('postcss-write-svg') // 用于解决1像素问题
const precss = require('precss') // 使用类scss语法 其中包含postcss-preset-env 可以使用stage2 及以后的语法
const functions = require('postcss-functions') // 定义css中方法  此处是处理px转rem问题


module.exports = {
  plugins: [
    functions({
      functions: {
        px2rem: function($val) {
          return $val / 64 * 1 + 'rem'
        },
      },
    }),
    postcssWriteSvg(),
    // sprites({
    //   filterBy: [],
    //   spritePath: './dist/images/',
    // }),
    // pxtoviewport({
    //   viewportWidth: 750, // 设计稿尺寸
    //   viewportHeight: 1334,
    //   unitPrecision: 5, // 单位精确位数
    //   viewportUnit: 'vw',
    //   selectorBlackList: [],
    //   minPixelValue: 1,
    //   mediaQuery: false
    // }),
    precss(),
    // postcssPresetEnv(),
  ],
}
