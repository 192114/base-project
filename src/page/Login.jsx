import React, { useState } from 'react'
import Icon from '../component/Icon'
import '../assets/styles/login.css'

const Login = () => {
  // hooks usage
  const [userName, setUerName] = useState('')
  const handleNameChange = e => setUerName(e.target.value)
  // effect hooks

  return (
    <div styleName="container" id="particle-container">
      <section styleName="input-section">
        <label htmlFor="userName">
          <Icon iconName="account" />
          <input type="text" name="userName" id="userName" value={userName} onChange={handleNameChange} placeholder="请输入账号" />
        </label>
      </section>
    </div>
  )
}

export default Login
