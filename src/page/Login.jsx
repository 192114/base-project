import React, { useState } from 'react'
import Icon from '../component/Icon'

import '../assets/styles/login.css'

const Login = () => {
  // hooks usage
  const [name, setName] = useState('Sunny')
  const handleNameChange = e => setName(e.target.value)

  // effect hooks

  return (
    <div>
      <Icon styleName="title-icon" />
      name:
      <input name="name" value={name} onChange={handleNameChange} />
    </div>
  )
}

export default Login
