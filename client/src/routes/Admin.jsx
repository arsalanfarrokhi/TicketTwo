import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import FlightList from '../components/FlightList';
import HeaderAdmin from '../components/HeaderAdmin';
import TravelerList from '../components/TravelerList';
import UserList from '../components/UserList';
import PurchaseForm from '../components/PurchaseForm';

import { AdminTableContext } from '../context/AdminTable';

const Admin= () =>{
    const history = useHistory();
    const logedIn = Cookies.get('LogedIn');

    if(logedIn === 'false' || logedIn == null){
        history.push('/login');
    }

    if(Cookies.get('privilege') !== 'admin'){
        history.push('/');
    }

    const { AdminTable } = useContext(AdminTableContext);
    console.log(AdminTable);
    
    return(
        <div>
            <HeaderAdmin/>
            {(AdminTable === "users" || AdminTable === null) && <UserList/>}
            {(AdminTable === "travelers" ) && <TravelerList/>}  
            {(AdminTable === "flights") && <FlightList/>}            
            {AdminTable==="purchase" && <PurchaseForm/>}
        </div>
        
    )
}
export default Admin