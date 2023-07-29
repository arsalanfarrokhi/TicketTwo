import React, {useContext} from 'react'
import HeaderUser from '../components/HeaderUser'
import UserInfo from '../components/UserInfo'
import TicketsOfUser from '../components/TicketsOfUser'
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UsersContext } from '../context/UsersContext';


const User = () => {
  const history = useHistory();
    const logedIn = Cookies.get('LogedIn')
    if(logedIn === 'false' || logedIn == null){
        history.push('/login');
    }
    if(Cookies.get('privilege') !== 'user'){
        history.push('/');
    }
    const {users} = useContext(UsersContext);
  return (
    <div>
      <HeaderUser/>
      <UserInfo/>
      <div >
        <p class="text-success">_________________________________________________________________________________________</p>
     </div>
      <h3>View Your Tickets</h3>
      <TicketsOfUser/>
      
    </div>
  )
}

export default User;