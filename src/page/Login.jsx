import React, { useState } from 'react'

const Login = () => {
  // hooks usage
  const [name, setName] = useState('Sunny')
  const handleNameChange = e => setName(e.target.value)

  // effect hooks

  return (
    <div>
      name:
      <input name="name" value={name} onChange={handleNameChange} />
    </div>
  )
}

export default Login
