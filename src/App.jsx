import React, { lazy, Suspense } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import Loading from './component/Loading'

// 引入normalize.css
import 'normalize.css'
// 引入全局几本样式
import './assets/styles/app.css'

const Home = lazy(() => import(/* webpackChunkName: "home" */'./page/Home'))
const TodoList = lazy(() => import(/* webpackChunkName: "todolist" */'./page/TodoList'))
const Login = lazy(() => import(/* webpackChunkName: "login" */'./page/Login'))
const Weather = lazy(() => import(/* webpackChunkName: "login" */'./page/Weather'))

const App = () => (
  <Router>
    <Route render={({ location, history }) => {
      const classNames = history.action === 'PUSH' ? 'next' : 'pre'
      return (
        <TransitionGroup
          childFactory={child => React.cloneElement(child, {
            classNames,
          })}
        >
          <CSSTransition
            key={location.key}
            timeout={250}
          >
            <Suspense fallback={<Loading />}>
              <Switch location={location}>
                <Route exact path="/" component={Home} />
                <Route path="/todo" component={TodoList} />
                <Route path="/login" component={Login} />
                <Route path="/weather" component={Weather} />
                <Route render={() => <div>not found</div>} />
              </Switch>
            </Suspense>
          </CSSTransition>
        </TransitionGroup>
      )
    }
  } />
  </Router>
)

export default App
