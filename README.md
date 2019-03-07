## babel部分记录
 1. @babel/core babel核心部分，将代码分析转换成AST
 2. @babel/plugin-transform-runtime （构建过程中代码转换）
  - 依赖某个函数时，自动从babel-runtime/函数名称（不污染当前环境）
  - 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件（实现polyfill的功能且无全局污染，但是实例方法无法正常使用，如 “foobar”.includes(“foo”) ）。
  - 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替（提取babel转换语法的代码）
 3. @babel/runtime（实际导入的功能模块） 将依赖的全局内置对象，抽取出单独的模块，并通过导入的方式引入
 4. @babel/preset-env和@babel/preset-react 它能根据当前的运行环境，自动确定你需要的 plugins 和 polyfills
 5. @babel/plugin-proposal-class-properties   不用使用bind去绑定this
    ```javascript
      class Bork {
        boundFunction = () => {
          return this.state;
        }
      }
    ```

 > Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。

 > ### transform-runtime 对比 babel-polyfill
  >- babel-polyfill 是当前环境注入这些 es6+ 标准的垫片，好处是引用一次，不再担心兼容，而且它就是全局下的包，代码的任何地方都可以使用。缺点也很明显，它可能会污染原生的一些方法而把原生的方法重写。如果当前项目已经有一个 polyfill 的包了，那你只能保留其一。而且一次性引入这么一个包，会大大增加体积。如果你只是用几个特性，就没必要了，如果你是开发较大的应用，而且会频繁使用新特性并考虑兼容，那就直接引入吧。
  > transform-runtime 是利用 plugin 自动识别并替换代码中的新特性，你不需要再引入，只需要装好 babel-runtime 和 配好 plugin 就可以了。好处是按需替换，检测到你需要哪个，就引入哪个 polyfill，如果只用了一部分，打包完的文件体积对比 babel-polyfill 会小很多。而且 transform-runtime 不会污染原生的对象，方法，也不会对其他 polyfill 产生影响。所以 transform-runtime 的方式更适合开发工具包，库，一方面是体积够小，另一方面是用户（开发者）不会因为引用了我们的工具，包而污染了全局的原生方法，产生副作用，还是应该留给用户自己去选择。缺点是随着应用的增大，相同的 polyfill 每个模块都要做重复的工作（检测，替换），虽然 polyfill 只是引用，编译效率不够高效。
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
 > - [postcss-extend-rule](https://github.com/jonathantneal/postcss-extend-rule)
 > - [postcss-advanced-variables](https://github.com/jonathantneal/postcss-advanced-variables)
 > - [postcss-preset-env](https://preset-env.cssdb.org/)
 > - [postcss-atroot](https://github.com/OEvgeny/postcss-atroot)
 > - [postcss-property-lookup](https://github.com/simonsmith/postcss-property-lookup)
 > - [postcss-nested](https://github.com/postcss/postcss-nested)
9. stylelint
  - stylelint-config-standard
  *css规则*
  - stylelint-scss
  *stylelint插件 检测sass语法*
10. svg-sprite-loader
*使用svg小图标将svg代码添加到html中 https://juejin.im/post/59bb864b5188257e7a427c09*
 - svgo 压缩svg 删除无用的代码
11. babel-plugin-react-css-modules
*css模块化 以组件分割 https://github.com/gajus/babel-plugin-react-css-modules*

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

## webpack 部分
1. 加入dll优化
 - 在首次构建项目时，先生成dll，可以增加打包速度
 - 在开发环境，配置devserver的contentBase将dll作为一个静态文件目录

2. rimraf模块
*（npm i rimraf -D）用于删除文件或文件夹*

3. cpr模块
*（npm i cpr -D）用于拷贝文件或文件夹*

   - *usage: cpr \<source> \<destination> [options]*
   - *cpr 默认是不覆盖的，需要显示传入 -o 配置项*

4. make-dir-cli
*用于创建目录*

5. 多线程编译（thread-loader或者happypack，在性能好的机器上有提升）
 - thread-loader 不能与 mini-css-extract-plugin 结合使用

 - happypack使用
  ```javascript
    const HappyPack = require('happypack');
    const os = require('os');
    const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
    const happyLoaderId = 'happypack-for-react-babel-loader';

    module.exports = {
      module: {
        rules: [{
          test: /\.jsx?$/,
          loader: 'happypack/loader',
          query: {
            id: happyLoaderId
          },
          include: [path.resolve(process.cwd(), 'src')]
        }]
      },
      plugins: [new HappyPack({
        id: happyLoaderId,
        threadPool: happyThreadPool,
        loaders: ['babel-loader']
      })]
    }
  ```
  - thread-loader 使用 *(每个worker都是一个单独的node.js进程，其开销约为600ms，所以打小项目时候时间会变长)*
  ```javascript
    module.exports = {
      module: {
        rules: [
          {
            test: /\.js$/,
            include: path.resolve("src"),
            use: [
              "thread-loader",
              // your expensive loader (e.g babel-loader)
              "babel-loader"
            ]
          }
        ]
      }
    }
  ```

6. DllPlugin && DllReferencePlugin && autodll-webpack-plugin
  > - dllPlugin将模块预先编译，DllReferencePlugin 将预先编译好的模块关联到当前编译中，当 webpack 解析到这些模块时，会直接使用预先编译好的模块。
  > - autodll-webpack-plugin 相当于 dllPlugin 和 DllReferencePlugin 的简化版，其实本质也是使用 dllPlugin && DllReferencePlugin，它会在第一次编译的时候将配置好的需要预先编译的模块编译在缓存中，第二次编译的时候，解析到这些模块就直接使用缓存，而不是去编译这些模块

7. speed-measure-webpack-plugin 打包个loader和plugin耗时分析（出现了html-webpack-include-assets-plugin注入失败（不清楚原因））

  ```javascript
  // webpack 打包分析
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

  const smp = new SpeedMeasurePlugin()

  smp.wrap({
    /** config **/
  })
  ```

8. 缓存问题

  *我们使用 [cache-loader](https://github.com/webpack-contrib/cache-loader) 来缓存结果（[babel-loader](https://github.com/babel/babel-loader) 的用户通常会优先选择使用它的 内建缓存，[UglifyJSPlugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) 的 内建缓存，以及加入了 [HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin)*

  *最后要注意的是，每当程序包依赖性发生变化时，请记住清除缓存 - 可以使用 npm postinstall script 自动执行。*

  *HardSourceWebpackPlugin 缓存的默认存储路径是：node_modules/.cache/hard-source/[confighash]*

  *使用npm run rmcache 删除node_modules下的.cache目录清除缓存*

9. 关于webpack4.29.0 import()报错问题
  ```
    ERROR in ./src/App.jsx 9:9
    Module parse failed: Unexpected token (9:9)
    You may need an appropriate loader to handle this file type.
    | import { BrowserRouter as Router, Route } from 'react-router-dom';
    | var Home = lazy(function () {
    >   return import('./page/Home');
    | });
    | var About = lazy(function () {
    @ ./src/HotMiddlePage.jsx 8:0-24 10:19-22
    @ ./src/index.jsx
    @ multi (webpack)-dev-server/client?http://localhost:3000 (webpack)/hot/dev-server.js ./src/index.jsx
  ```
  原因及解决方案: https://github.com/webpack/webpack/issues/8656

## 开发中的配置
1. react-hot-loader 开启热更新
 *（npm i react-hot-loader）*
 - 推荐方式
   - babel中配置插件 "react-hot-loader/babel"
   - 在代码中使用
   ```javascript
    // 这种方式 React 16.6+ features may not work
    import { hot } from 'react-hot-loader/root'
    import App from './App'

    export default hot(App)
   ```
 - 想用的方式
  *（npm i @hot-loader/react-dom@YOUR_REACT_VERSION）*
  - 在webpack配置中配置 用包含补丁的react-dom替换真正的react-dom *（没成功 待尝试）*
  ```javascript
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    }
  ```
2. 代码分割+按需加载
  - react 原生支持的 lazy方法(不支持服务端渲染 推荐使用Loadable Components)

    *使用babel时需要配置@babel/plugin-syntax-dynamic-import 支持使用import()方法*

    ```javascript
      const OtherComponent = React.lazy(() => import('./OtherComponent'));

      function MyComponent() {
        return (
          <div>
            <OtherComponent />
          </div>
        );
      }
    ```
## 代码相关
1. react 支持svg问题
  ```javascript
    <svg className="icon" aria-hidden="true">
      <use xlink:href="#hfq-home_fill"></use>
    </svg>
    <!-- react需要写成 -->
    <!-- 将xlink:href替换成xlinkHref -->
    <svg styleName="svg-icon" aria-hidden="true"><use xlinkHref={`#icon-${iconName}`} /></svg>
  ```
