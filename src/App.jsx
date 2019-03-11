import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from './component/Loading'

// 引入normalize.css
import 'normalize.css'
// 引入全局几本样式
import './assets/styles/app.css'

// const Home = lazy(() => import(/* webpackChunkName: "home" */'./page/Home'))
const About = lazy(() => import(/* webpackChunkName: "about" */'./page/About'))
const Login = lazy(() => import(/* webpackChunkName: "login" */'./page/Login'))

const App = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" component={Loading} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
      </Switch>
    </Suspense>
  </Router>
)

export default App
