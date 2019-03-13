import React, { useState } from 'react'
import Icon from '../component/Icon'
import '../assets/styles/login.css'

const Login = ({ history }) => {
  // hooks usage
  const [userName, setUerName] = useState('')
  const [password, setPassword] = useState('')
  const handleNameChange = e => setUerName(e.target.value)
  const handlePasswordChange = e => setPassword(e.target.value)

  const login = () => {
    console.log(userName, password)
    history.push('/')
  }

  // effect hooks

  return (
    <div styleName="container" id="particle-container">
      <section styleName="input-section">
        <label htmlFor="userName">
          <Icon iconName="account" />
          <input type="text" name="userName" id="userName" value={userName} onChange={handleNameChange} placeholder="请输入账号" />
        </label>
        <label htmlFor="password">
          <Icon iconName="account" />
          <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} placeholder="请输入密码" />
        </label>
        <button styleName="submit-btn" type="button" onClick={login}>登录</button>
      </section>
    </div>
  )
}

export default Login
