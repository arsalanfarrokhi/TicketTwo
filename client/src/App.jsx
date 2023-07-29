import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

import Admin from "./routes/Admin"
import Flights from "./routes/Flights"
import Home from "./routes/Home";
import Login from "./routes/Login"
import Travelers from "./routes/Travelers"
import User from "./routes/User"						

import { FlightsContextProvider } from './context/FlightsContext';
import { TravelersContextProvider } from './context/TravelersContext';
import { AdminTableContextProvider } from './context/AdminTable';
import { UsersContextProvider } from './context/UsersContext';
import { UsersTicketsContextProvider } from './context/UsersTicketsContext';

const ProtectedRoute = ({component: Component, ...rest}) =>{
    const logedIn = Cookies.get(['LogedIn']);
    const history = useHistory();
    if(logedIn === 'false' || logedIn == null){
        history.push('/login');
    }
    return(
        <Route {...rest}
        render = {()=>(
            <Component/>
            )}
            />
            )
}
        
const App = () =>{
    return(
        <UsersContextProvider>
        <AdminTableContextProvider>
        <FlightsContextProvider>
        <TravelersContextProvider>
		<UsersTicketsContextProvider>    
            <div className='container'>
                    <Router>
                    <Switch>
                        <ProtectedRoute exact path='/' component={Login}/>
                        <Route exact path='/flights/:from/:to/:when' component={Flights}/>
                        <Route path='/login' component={Login}/>
                        <Route exact path='/admin' component={Admin}/>
						<Route exactly path='/user_page' component={User}/>
                    </Switch>
                    </Router>
            </div>
		</UsersTicketsContextProvider> 
        </TravelersContextProvider>
        </FlightsContextProvider>
        </AdminTableContextProvider>
        </UsersContextProvider>


    )
}
export default App;