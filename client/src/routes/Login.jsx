import React from 'react'
import LoginForm from '../components/LoginForm'
const Login = () => {
  return (
    <div className='m-5'>
      <div className='m-5 p-5'>
        <h1 className='font-weight-light display-1 text-center'>Welcome to TickeTwo!</h1>
      </div>
      <div className='m-5'>
        <LoginForm/>
      </div>
    </div>
  )
}

export default Login
