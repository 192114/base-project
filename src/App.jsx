import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('./page/Home'))
const About = lazy(() => import('./page/About'))

const App = () => (
  <Router>
    <Suspense fallback={<div>loadding</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
)

export default App
