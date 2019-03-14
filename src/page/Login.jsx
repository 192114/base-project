import React, { useState, useEffect } from 'react'
import propTypes from 'prop-types'
import Icon from '../component/Icon'
import '../assets/styles/login.css'

// hooks 函数的封装（处理input）
const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = e => setValue(e.target.value)
  return {
    value,
    onChange: handleChange,
  }
}

const Login = ({ history }) => {
  // hooks usage
  // const [userName, setUerName] = useState('')
  // const [password, setPassword] = useState('')
  // const handleNameChange = e => setUerName(e.target.value)
  // const handlePasswordChange = e => setPassword(e.target.value)
  const username = useInput('')
  const password = useInput('')

  const login = () => {
    history.push('/')
  }

  // effect hooks
  useEffect(() => {
    document.title = username.value
    // 如果需要在组件卸载移出事件
    // return () => {func()}
  })

  return (
    <div styleName="container" id="particle-container">
      <section styleName="input-section">
        <label htmlFor="userName">
          <Icon iconName="account" />
          <input type="text" name="userName" id="userName" {...username} placeholder="请输入账号" />
        </label>
        <label htmlFor="password" className="mt10">
          <Icon iconName="password" />
          <input type="password" name="password" id="password" {...password} placeholder="请输入密码" />
        </label>
        <button styleName="submit-btn" type="button" onClick={login}>登录</button>
      </section>
    </div>
  )
}

Login.defaultProps = {
  history: {},
}

Login.propTypes = {
  history: propTypes.shape({}),
}

export default Login
