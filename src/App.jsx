import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// 引入normalize.css
import 'normalize.css'

const Home = lazy(() => import(/* webpackChunkName: "home" */'./page/Home'))
const About = lazy(() => import(/* webpackChunkName: "about" */'./page/About'))
const Login = lazy(() => import(/* webpackChunkName: "login" */'./page/Login'))

const App = () => (
  <Router>
    <Suspense fallback={<div>loadding</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
      </Switch>
    </Suspense>
  </Router>
)

export default App
