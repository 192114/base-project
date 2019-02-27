## babel部分记录
 1. @babel/core babel核心部分，将代码分析转换成AST
 2. @babel/plugin-transform-runtime （构建过程中代码转换）
  - 依赖某个函数时，自动从babel-runtime/函数名称（不污染当前环境）
  - 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件（实现polyfill的功能且无全局污染，但是实例方法无法正常使用，如 “foobar”.includes(“foo”) ）。
  - 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替（提取babel转换语法的代码）
 3. @babel/runtime（实际导入的功能模块） 将依赖的全局内置对象，抽取出单独的模块，并通过导入的方式引入
 4. @babel/preset-env和@babel/preset-react 它能根据当前的运行环境，自动确定你需要的 plugins 和 polyfills
 > Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。

 > ### transform-runtime 对比 babel-polyfill
  - babel-polyfill 是当前环境注入这些 es6+ 标准的垫片，好处是引用一次，不再担心兼容，而且它就是全局下的包，代码的任何地方都可以使用。缺点也很明显，它可能会污染原生的一些方法而把原生的方法重写。如果当前项目已经有一个 polyfill 的包了，那你只能保留其一。而且一次性引入这么一个包，会大大增加体积。如果你只是用几个特性，就没必要了，如果你是开发较大的应用，而且会频繁使用新特性并考虑兼容，那就直接引入吧。
  - transform-runtime 是利用 plugin 自动识别并替换代码中的新特性，你不需要再引入，只需要装好 babel-runtime 和 配好 plugin 就可以了。好处是按需替换，检测到你需要哪个，就引入哪个 polyfill，如果只用了一部分，打包完的文件体积对比 babel-polyfill 会小很多。而且 transform-runtime 不会污染原生的对象，方法，也不会对其他 polyfill 产生影响。所以 transform-runtime 的方式更适合开发工具包，库，一方面是体积够小，另一方面是用户（开发者）不会因为引用了我们的工具，包而污染了全局的原生方法，产生副作用，还是应该留给用户自己去选择。缺点是随着应用的增大，相同的 polyfill 每个模块都要做重复的工作（检测，替换），虽然 polyfill 只是引用，编译效率不够高效。
  *(值得注意的是，instance 上新添加的一些方法，babel-plugin-transform-runtime 是没有做处理的，比如 数组的 includes, filter, fill 等，这个算是一个关键问题吧，直接推荐用 polyfill)*

## postcss 部分记录

1. postcss-functions
*可以定义css全局的函数（比如px转rem函数等）*
2. postcss-loader
*webpack上的loder*
3. postcss-preset-env
*可以使用未来的css特性 https://preset-env.cssdb.org/*
4. postcss-px-to-viewport
*根据设计稿将px转换成vm vh（暂未使用，现使用vw+rem实现）*
5. postcss-reporter
*输出postcss日志*
6. postcss-sprites
*生成雪碧图*
7. postcss-write-svg
*使用行内的svg（目前用于解决1pxborder问题）*
8. precss
*可以使用类scss语法*
 > 其中包含：
 > - postcss-extend-rule
 > - postcss-advanced-variables
 > - postcss-preset-env
 > - postcss-atroot
 > - postcss-property-lookup
 > - postcss-nested
9. stylelint
  - stylelint-config-standard
  *css规则*
  - stylelint-scss
  *stylelint插件 检测sass语法*
10. svg-sprite-loader
*使用svg小图标将svg代码添加到html中 https://juejin.im/post/59bb864b5188257e7a427c09*
 - svgo 压缩svg 删除无用的代码
11. babel-plugin-react-css-modules
*css模块化 以组件分割*

## browserslist内容记录
*https://github.com/browserslist/browserslist*

可以用在package.json:
``` javascript
  {
  "browserslist": [
    "last 1 version",
    "> 1%",
    "maintained node versions",
    "not dead"
  ]
}
```

或者用在.browserslistrc中:

```
# Browsers that we support

last 1 version
> 1%
maintained node versions
not dead
```
**Browserslist使用[Can I Use](https://caniuse.com/)数据查询**

  ### 查找配置顺序
  1. package.json 的 browserslist键 （推荐）
  2. 工具选项（如Autoprefixer 的 browsers）
  3. BROWSERSLIST 环境
  4. 当前目录或父目录的browserslist配置
  5. 当前目录或父目录的.browserslistrc
  6. 都没有就默认：> 0.5%, last 2 versions, Firefox ESR, not dead

## eslint 部分
使用Airbnb的语法规则：
```
npx install-peerdeps --dev eslint-config-airbnb
```
配置：
```javascript
module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true
  },
  "plugins": [ "react", "jsx-a11y", "import" ],
  "rules": {
    "semi": [ 0 ], // 可以省略分号
  }
}
```
