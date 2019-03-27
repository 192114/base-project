import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => (
  <div className="container" style={{ background: '#fff' }}>
    <Link to="/todo">todolist</Link>
    <br />
    <Link to="/weather">get weather</Link>
    <br />
    <Link to="/indexDB">indexDB</Link>
  </div>
)

export default Home
