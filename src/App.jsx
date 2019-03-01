import React, { lazy } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

const Home = lazy(() => import('./page/Home'))
const About = lazy(() => import('./page/About'))

const App = () => (
  <Router>
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
  </Router>
)

export default App
