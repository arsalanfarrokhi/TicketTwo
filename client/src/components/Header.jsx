import React from 'react'
import Cookies from 'js-cookie'

const Header = () => {
  const handleSubmit = () =>{
    Cookies.set('LogedIn', "false");
    Cookies.remove('email');
  }
  return (
  <div>
    <nav className="navbar navbar-light bg-light justify-content-between">
      <p className='font-weight-light display-6 text-center'>TickeTwo</p>

      <form className="form-inline">
        <button className="btn btn-outline-success" type="submit" onClick={handleSubmit}>Logout</button>
      </form>
      
    </nav>
    <h1 className='font-weight-light display-1 text-center'>Hello, {Cookies.get('email')}!</h1>
  </div>
  )
}

export default Header