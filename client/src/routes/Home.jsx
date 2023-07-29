import React from 'react'
import Header from '../components/Header'
import Cookies from 'js-cookie'
import { useHistory } from 'react-router-dom'
const Home = () => {
  const logedIn = Cookies.get(['LogedIn']);
  const history = useHistory();
  if(logedIn === 'false' || logedIn == null){
        history.push('/login');
    }
  if(Cookies.get('privilege') === 'admin'){
    history.push('/admin');
  }
  return (
    <div>
      <Header/>
      <h1>Tickets</h1>
    </div>
  )
  
}

export default Home
