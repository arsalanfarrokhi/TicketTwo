import Cookies from 'js-cookie'
import React, { useContext } from 'react'

import { AdminTableContext } from '../context/AdminTable';

const HeaderAdmin = () => {
  const { setAdminTable } = useContext(AdminTableContext);

  function Table(e) {
    let state = e.target.text.toLowerCase()
    if(state === "purchase a ticket"){
      state = "purchase";
    }
    setAdminTable(state);
  }

  const handleSubmit = () => {
    Cookies.set('LogedIn', "false");
    Cookies.remove('email');
    Cookies.remove('privilege');
  }

  return (
    <div>
      {/* <h1 className='font-weight-light display-1 text-center'>TickeTwo</h1> */}
      <br/>
      <nav className="navbar navbar-expand-lg bg-primary bg-gradient row">
        <div className="container-fluid">
          <div className='col-2'>
          <a className="navbar-brand fs-2 text-light" href="#">TickeTwo</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          </div>
          <div className="collapse navbar-collapse col-8" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={Table}>Users</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={Table}>Travelers</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={Table}>Flights</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light" href="#" onClick={Table}>Purchase a ticket</a>
              </li>
            </ul>
          </div>
          <div className='col-1 mr-2'>
          <form className="form-inline col-1align-items-end">
              <button className="btn btn-success" type="submit" onClick={handleSubmit}>Logout</button>
            </form>
          </div>
        </div>
      </nav>
      <br/>
    </div>
  )
}

export default HeaderAdmin
